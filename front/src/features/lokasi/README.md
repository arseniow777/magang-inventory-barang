# Lokasi Feature

This feature handles location management for item storage.

## Structure

```
lokasi/
├── api/
│   └── lokasi.api.ts          # API client functions (connected to backend)
├── components/
│   └── data-table.tsx         # Reusable data table component
├── data/
│   └── dummy-data.ts          # Legacy dummy data (not used)
├── hooks/
│   └── usePermintaanData.ts   # TanStack Query hooks for locations
├── pages/
│   └── LokasiPage.tsx         # Main page component
└── types/
    ├── lokasi.types.ts        # TypeScript types for locations
    └── permintaan.types.ts    # Legacy types (kept for compatibility)
```

## Current Status

✅ **Working Features:**

- Real-time data fetching from backend API using TanStack Query
- Table display with pagination
- Column visibility toggle
- Actions dropdown menu (Edit, View Details)
- Sorting and filtering
- Error handling
- Loading states
- Automatic cache management (5 min stale time)

✅ **API Integration:**

- `useLokasiData()` - Fetch all locations
- `useLokasi(id)` - Fetch single location
- `useCreateLokasi()` - Create new location
- `useUpdateLokasi()` - Update existing location
- `useDeleteLokasi()` - Delete location

## Data Structure

```typescript
interface LocationData {
  id: number;
  location_code: string; // e.g., "ged-1" (generated from building name + floor)
  building_name: string; // e.g., "Gedung A"
  floor: number; // e.g., 1, 2, 3
  address: string; // Full address
}
```

## Usage Example

```tsx
import { useLokasiData } from "../hooks/usePermintaanData";

function MyComponent() {
  const { data: locations = [], isLoading, error } = useLokasiData();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading locations</div>;

  return <DataTable data={locations} />;
}
```

## Backend Integration

The feature is connected to:

- **Endpoint**: `/api/v1/locations`
- **Authentication**: Required (Bearer token)
- **Permissions**:
  - GET operations: All authenticated users
  - POST/PUT/DELETE: Admin only

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
