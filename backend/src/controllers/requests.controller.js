import prisma from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { createAuditLog } from "../utils/audit.js";
import { generateRequestCode, generateReportNumber } from "../utils/smartCode.js";
import { generateOfficialReport } from "../utils/pdfGenerator.js";
import { sendTelegramMessage } from "../utils/telegramBot.js";

export const createRequest = async (req, res, next) => {
  try {
    const { request_type, reason, destination_location_id, items } = req.body;

    if (!request_type || !reason || !items || items.length === 0) {
      return sendError(res, "Request type, reason, dan items wajib diisi", 400);
    }

    if ((request_type === 'borrow' || request_type === 'transfer') && !destination_location_id) {
      return sendError(res, "Lokasi tujuan wajib untuk borrow/transfer", 400);
    }

    if (destination_location_id) {
      const location = await prisma.locations.findUnique({
        where: { id: parseInt(destination_location_id) }
      });
      if (!location) {
        return sendError(res, "Lokasi tujuan tidak ditemukan", 404);
      }
    }

    const selectedUnits = [];

    for (const item of items) {
        if (item.unit_id) {
            const unit = await prisma.itemUnits.findUnique({
            where: { id: parseInt(item.unit_id) }
            });

            if (!unit) {
            return sendError(res, `Unit ID ${item.unit_id} tidak ditemukan`, 404);
            }

            if (unit.status !== 'available') {
            return sendError(res, `Unit ${unit.unit_code} tidak tersedia (status: ${unit.status})`, 400);
            }

            // TAMBAH VALIDASI INI:
            const pendingRequest = await prisma.requestItems.findFirst({
            where: {
                unit_id: parseInt(item.unit_id),
                request: {
                status: 'pending'
                }
            }
            });

            if (pendingRequest) {
            return sendError(res, `Unit ${unit.unit_code} sedang menunggu approval`, 400);
            }

            selectedUnits.push(unit.id);
        } else if (item.item_id && item.quantity) {
            const pendingUnitIds = await prisma.requestItems.findMany({
            where: {
                request: { status: 'pending' },
                unit: { item_id: parseInt(item.item_id) }
            },
            select: { unit_id: true }
            });

            const availableUnits = await prisma.itemUnits.findMany({
            where: {
                item_id: parseInt(item.item_id),
                status: 'available',
                id: { notIn: pendingUnitIds.map(p => p.unit_id) }
            },
            take: parseInt(item.quantity)
            });

            if (availableUnits.length < parseInt(item.quantity)) {
            return sendError(res, `Hanya ${availableUnits.length} unit tersedia untuk item ID ${item.item_id}`, 400);
            }

            selectedUnits.push(...availableUnits.map(u => u.id));
        } else {
            return sendError(res, "Setiap item harus punya unit_id atau (item_id + quantity)", 400);
        }
    }

    const request_code = await generateRequestCode();

    const request = await prisma.requests.create({
      data: {
        request_code,
        request_type,
        reason,
        destination_location_id: destination_location_id ? parseInt(destination_location_id) : null,
        pic_id: req.user.id,
        request_items: {
          create: selectedUnits.map(unit_id => ({ unit_id }))
        }
      },
      include: {
        pic: true,
        destination_location: true,
        request_items: {
          include: {
            unit: {
              include: {
                item: true,
                location: true
              }
            }
          }
        }
      }
    });

    await createAuditLog({
      actor_id: req.user.id,
      actor_role: req.user.role,
      action: "CREATE",
      entity_type: "Requests",
      entity_id: request.id,
      description: `Request ${request.request_code} dibuat oleh ${req.user.username}`,
      user_agent: req.headers["user-agent"],
    });

    const admins = await prisma.users.findMany({ where: { role: 'admin' } });

    await Promise.all(
      admins.map(admin =>
        prisma.notifications.create({
          data: {
            user_id: admin.id,
            message: `${req.user.name} membuat request ${request_code} (${request_type})`,
            type: 'request'
          }
        })
      )
    );

    return sendSuccess(res, "Request berhasil dibuat", request, 201);
  } catch (err) {
    next(err);
  }
};

export const getRequests = async (req, res, next) => {
  try {
    const { status, request_type, pic_id } = req.query;

    const where = {};
    if (status) where.status = status;
    if (request_type) where.request_type = request_type;
    if (pic_id) where.pic_id = parseInt(pic_id);

    const requests = await prisma.requests.findMany({
      where,
      include: {
        pic: true,
        admin: true,
        destination_location: true,
        _count: {
          select: { request_items: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return sendSuccess(res, "Data requests berhasil diambil", requests);
  } catch (err) {
    next(err);
  }
};

export const getRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const request = await prisma.requests.findUnique({
      where: { id: parseInt(id) },
      include: {
        pic: true,
        admin: true,
        destination_location: true,
        request_items: {
          include: {
            unit: {
              include: {
                item: {
                  include: { photos: true }
                },
                location: true
              }
            }
          }
        }
      }
    });

    if (!request) {
      return sendError(res, "Request tidak ditemukan", 404);
    }

    return sendSuccess(res, "Data request berhasil diambil", request);
  } catch (err) {
    next(err);
  }
};

export const getMyRequests = async (req, res, next) => {
  try {
    const requests = await prisma.requests.findMany({
      where: { pic_id: req.user.id },
      include: {
        admin: true,
        destination_location: true,
        _count: {
          select: { request_items: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return sendSuccess(res, "Data my requests berhasil diambil", requests);
  } catch (err) {
    next(err);
  }
};

export const getPendingRequests = async (req, res, next) => {
  try {
    const requests = await prisma.requests.findMany({
      where: { status: 'pending' },
      include: {
        pic: true,
        destination_location: true,
        _count: {
          select: { request_items: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return sendSuccess(res, "Data pending requests berhasil diambil", requests);
  } catch (err) {
    next(err);
  }
};

export const approveRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const request = await prisma.requests.findUnique({
      where: { id: parseInt(id) },
      include: {
        pic: true,
        request_items: {
          include: {
            unit: {
              include: { 
                item: true,
                location: true 
              }
            }
          }
        },
        destination_location: true
      }
    });

    if (!request) {
      return sendError(res, "Request tidak ditemukan", 404);
    }

    if (request.status !== 'pending') {
      return sendError(res, `Request sudah ${request.status}`, 400);
    }

    const statusMap = {
      borrow: 'borrowed',
      transfer: 'transferred',
      sell: 'sold',
      demolish: 'demolished'
    };

    const newStatus = statusMap[request.request_type];

    for (const requestItem of request.request_items) {
      await prisma.itemUnits.update({
        where: { id: requestItem.unit_id },
        data: {
          status: newStatus,
          ...(request.destination_location_id && {
            location_id: request.destination_location_id
          })
        }
      });

      if (request.request_type === 'borrow' || request.request_type === 'transfer') {
        await prisma.itemLogHistory.create({
          data: {
            unit_id: requestItem.unit_id,
            from_location_id: requestItem.unit.location_id,
            to_location_id: request.destination_location_id,
            request_id: request.id,
            moved_by_id: req.user.id
          }
        });
      }
    }

    const updatedRequest = await prisma.requests.update({
      where: { id: parseInt(id) },
      data: {
        status: 'approved',
        approved_at: new Date(),
        admin_id: req.user.id
      },
      include: {
        pic: true,
        admin: true,
        destination_location: true,
        request_items: {
          include: {
            unit: {
              include: {
                item: true,
                location: true
              }
            }
          }
        }
      }
    });

    const reportNumber = await generateReportNumber();
    const pdfPath = await generateOfficialReport(updatedRequest, reportNumber);

    await prisma.officialReports.create({
      data: {
        report_number: reportNumber,
        report_type: request.request_type,
        file_path: pdfPath,
        request_id: request.id,
        issued_by_id: req.user.id,
        is_approved: true,
        approved_by_id: req.user.id,
        approved_at: new Date()
      }
    });

    await createAuditLog({
      actor_id: req.user.id,
      actor_role: req.user.role,
      action: "APPROVE",
      entity_type: "Requests",
      entity_id: request.id,
      description: `Request ${request.request_code} diapprove oleh ${req.user.username}`,
      user_agent: req.headers["user-agent"],
    });

    await prisma.notifications.create({
      data: {
        user_id: updatedRequest.pic_id,
        message: `Request ${updatedRequest.request_code} telah disetujui. Berita acara dapat diunduh.`,
        type: 'report'
      }
    });

    if (updatedRequest.pic.telegram_id) {
      const webUrl = process.env.WEB_URL || 'https://your-website.com';
      await sendTelegramMessage(
        updatedRequest.pic.telegram_id,
        `✅ Request ${updatedRequest.request_code} telah disetujui!\n\n📄 Berita Acara telah diterbitkan dan siap diunduh.\n\n👉 Silakan unduh dokumen melalui website kami:\n${webUrl}/reports`
      );
    }

    return sendSuccess(res, "Request berhasil diapprove", updatedRequest);
  } catch (err) {
    next(err);
  }
};

export const rejectRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const request = await prisma.requests.findUnique({
      where: { id: parseInt(id) },
      include: {
        pic: true,
        request_items: {
          include: {
            unit: {
              include: { item: true }
            }
          }
        }
      }
    });

    if (!request) {
      return sendError(res, "Request tidak ditemukan", 404);
    }

    if (request.status !== 'pending') {
      return sendError(res, `Request sudah ${request.status}`, 400);
    }

    const updatedRequest = await prisma.requests.update({
      where: { id: parseInt(id) },
      data: {
        status: 'rejected',
        admin_id: req.user.id
      },
      include: {
        pic: true,
        admin: true,
        destination_location: true,
        request_items: {
          include: {
            unit: {
              include: {
                item: true,
                location: true
              }
            }
          }
        }
      }
    });

    await createAuditLog({
      actor_id: req.user.id,
      actor_role: req.user.role,
      action: "REJECT",
      entity_type: "Requests",
      entity_id: request.id,
      description: `Request ${request.request_code} direject oleh ${req.user.username}`,
      user_agent: req.headers["user-agent"],
    });

    await prisma.notifications.create({
      data: {
        user_id: request.pic_id,
        message: `Request ${request.request_code} ditolak`,
        type: 'request'
      }
    });

    if (updatedRequest.pic.telegram_id) {
      await sendTelegramMessage(
        updatedRequest.pic.telegram_id,
        `❌ Request ${request.request_code} ditolak oleh admin`
      );
    }

    return sendSuccess(res, "Request berhasil direject", updatedRequest);
  } catch (err) {
    next(err);
  }
};

export const returnRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { return_location_id } = req.body;

    if (!return_location_id) {
      return sendError(res, "Lokasi return wajib diisi", 400);
    }

    const request = await prisma.requests.findUnique({
      where: { id: parseInt(id) },
      include: {
        request_items: {
          include: {
            unit: {
              include: { location: true }
            }
          }
        }
      }
    });

    if (!request) {
      return sendError(res, "Request tidak ditemukan", 404);
    }

    if (request.request_type !== 'borrow') {
      return sendError(res, "Hanya request borrow yang bisa direturn", 400);
    }

    if (request.status !== 'approved') {
      return sendError(res, "Request belum approved", 400);
    }

    if (request.returned_at) {
      return sendError(res, "Request sudah direturn", 400);
    }

    const location = await prisma.locations.findUnique({
      where: { id: parseInt(return_location_id) }
    });

    if (!location) {
      return sendError(res, "Lokasi return tidak ditemukan", 404);
    }

    for (const requestItem of request.request_items) {
      await prisma.itemUnits.update({
        where: { id: requestItem.unit_id },
        data: {
          status: 'available',
          location_id: parseInt(return_location_id)
        }
      });

      await prisma.itemLogHistory.create({
        data: {
          unit_id: requestItem.unit_id,
          from_location_id: requestItem.unit.location_id,
          to_location_id: parseInt(return_location_id),
          request_id: request.id,
          moved_by_id: req.user.id
        }
      });
    }

    const updatedRequest = await prisma.requests.update({
      where: { id: parseInt(id) },
      data: {
        status: 'completed',
        returned_at: new Date(),
        return_location_id: parseInt(return_location_id),
        returned_by_id: req.user.id
      },
      include: {
        pic: true,
        admin: true,
        destination_location: true,
        return_location: true,
        returned_by: true,
        request_items: {
          include: {
            unit: {
              include: {
                item: true,
                location: true
              }
            }
          }
        }
      }
    });

    await createAuditLog({
      actor_id: req.user.id,
      actor_role: req.user.role,
      action: "UPDATE",
      entity_type: "Requests",
      entity_id: request.id,
      description: `Request ${request.request_code} direturn oleh ${req.user.username}`,
      user_agent: req.headers["user-agent"],
    });

    const admins = await prisma.users.findMany({ where: { role: 'admin' } });

    await Promise.all(
      admins.map(admin =>
        prisma.notifications.create({
          data: {
            user_id: admin.id,
            message: `${req.user.name} mengembalikan barang dari request ${request.request_code}`,
            type: 'request'
          }
        })
      )
    );

    return sendSuccess(res, "Barang berhasil direturn", updatedRequest);
  } catch (err) {
    next(err);
  }
};

export const getMyRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const request = await prisma.requests.findUnique({
      where: { id: parseInt(id) },
      include: {
        pic: true,
        admin: true,
        destination_location: true,
        return_location: true,
        returned_by: true,
        request_items: {
          include: {
            unit: {
              include: {
                item: {
                  include: { photos: true }
                },
                location: true
              }
            }
          }
        }
      }
    });

    if (!request) {
      return sendError(res, "Request tidak ditemukan", 404);
    }

    if (request.pic_id !== req.user.id) {
      return sendError(res, "Anda tidak memiliki akses ke request ini", 403);
    }

    return sendSuccess(res, "Data request berhasil diambil", request);
  } catch (err) {
    next(err);
  }
};

export const cancelRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const request = await prisma.requests.findUnique({
      where: { id: parseInt(id) },
      include: {
        pic: true,
        request_items: {
          include: {
            unit: true
          }
        }
      }
    });

    if (!request) {
      return sendError(res, "Request tidak ditemukan", 404);
    }

    if (request.pic_id !== req.user.id) {
      return sendError(res, "Anda tidak bisa cancel request orang lain", 403);
    }

    if (request.status !== 'pending') {
      return sendError(res, `Request sudah ${request.status}, tidak bisa dicancel`, 400);
    }

    const updatedRequest = await prisma.requests.update({
      where: { id: parseInt(id) },
      data: {
        status: 'rejected'
      },
      include: {
        pic: true,
        destination_location: true,
        request_items: {
          include: {
            unit: {
              include: {
                item: true,
                location: true
              }
            }
          }
        }
      }
    });

    await createAuditLog({
      actor_id: req.user.id,
      actor_role: req.user.role,
      action: "UPDATE",
      entity_type: "Requests",
      entity_id: request.id,
      description: `Request ${request.request_code} dicancel oleh ${req.user.username}`,
      user_agent: req.headers["user-agent"],
    });

    return sendSuccess(res, "Request berhasil dicancel", updatedRequest);
  } catch (err) {
    next(err);
  }
};