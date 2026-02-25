import { useParams } from "react-router-dom";
import ItemDetail from "../components/ItemDetail";

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numericId = id ? parseInt(id) : null;

  return <ItemDetail id={numericId} />;
}
