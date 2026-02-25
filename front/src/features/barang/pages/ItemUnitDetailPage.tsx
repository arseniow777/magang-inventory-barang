import { useParams } from "react-router-dom";
import ItemUnitDetail from "../components/ItemUnitDetail";

export default function ItemUnitDetailPage() {
  const { itemId, unitId } = useParams<{ itemId: string; unitId: string }>();
  const numericItemId = itemId ? parseInt(itemId) : null;
  const numericUnitId = unitId ? parseInt(unitId) : null;

  return <ItemUnitDetail itemId={numericItemId} unitId={numericUnitId} />;
}
