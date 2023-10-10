import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

type Products = Array<Product>;

export default function transformFirestoreResponse(
  firestoreResponse: QueryDocumentSnapshot<DocumentData, DocumentData>[]
): Products {
  return firestoreResponse.map(doc => {
    const data = doc.data();
    const product: Product = {
      id: data['id'],
      name: data['name'],
      price: data['price'],
      description: data['description'],
    };
    return product;
  });
}
