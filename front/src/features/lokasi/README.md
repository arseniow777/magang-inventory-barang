# Permintaan Feature

This feature handles requests and borrowing of items.

## Structure

```
permintaan/
├── api/
│   └── permintaan.api.ts      # API client functions (ready for backend)
├── components/
│   └── data-table.tsx         # Reusable data table component
├── data/
│   └── dummy-data.ts          # Dummy data for development
├── hooks/
│   └── usePermintaanData.ts   # Hook to fetch data
├── pages/
│   └── PermintaanPage.tsx     # Main page component
└── types/
    └── permintaan.types.ts    # TypeScript types
```

## Current Status

✅ **Working Features:**
- Basic table display with dummy data
- Pagination
- Column visibility toggle
- Status badges
- Actions dropdown menu
- Sorting
- Filtering

⏸️ **Features Commented Out (requires package installation):**
- Drag & drop row reordering (`@dnd-kit/core`, `@dnd-kit/sortable`)
- Row selection with checkboxes (`@/components/ui/checkbox`)
- Toast notifications (`sonner`)
- Detail drawer viewer (`@/components/ui/drawer`)
- Charts display (`recharts`, `@/components/ui/chart`)

## Using Dummy Data (Current)

Currently, the feature uses dummy data defined in `data/dummy-data.ts`. This allows development without a backend.

## Switching to Real API

When the backend is ready, follow these steps:

### 1. Update the hook in `hooks/usePermintaanData.ts`:

```typescript
export function usePermintaanData() {
  // COMMENT OUT the dummy data implementation
  // and UNCOMMENT the real API implementation:
  
  return useQuery({
    queryKey: ["permintaan"],
    queryFn: () => permintaanAPI.getRequests(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
```

### 2. Update API endpoints in `api/permintaan.api.ts` if needed

Make sure the endpoints match your backend routes.

### 3. Update types in `types/permintaan.types.ts`

Adjust the `RequestData` interface to match your backend response structure.

## Enabling Advanced Features

To enable commented-out features, install the required packages:

```bash
# Drag and drop
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/modifiers @dnd-kit/utilities

# Toast notifications
npm install sonner

# Charts
npm install recharts
```

Then, in `components/data-table.tsx`:
1. Uncomment the imports at the top
2. Uncomment the drag handle component
3. Uncomment the select column
4. Uncomment the DraggableRow component
5. Uncomment the drag & drop logic in DataTable
6. Replace regular Table with DndContext wrapper

Also create missing UI components:
- `@/components/ui/checkbox`
- `@/components/ui/drawer`
- `@/components/ui/chart`

## Backend API Expected Endpoints

- `GET /api/v1/requests` - Get all requests
- `GET /api/v1/requests/:id` - Get single request
- `POST /api/v1/requests` - Create new request
- `PUT /api/v1/requests/:id` - Update request
- `DELETE /api/v1/requests/:id` - Delete request
- `POST /api/v1/requests/:id/approve` - Approve request
- `POST /api/v1/requests/:id/reject` - Reject request

## Access

The page is accessible at `/dashboard/permintaan`

