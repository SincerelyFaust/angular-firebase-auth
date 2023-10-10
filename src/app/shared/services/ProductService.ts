import { Injectable } from '@angular/core';
import {
  DocumentData,
  DocumentReference,
  QueryDocumentSnapshot,
  addDoc,
} from 'firebase/firestore';
import { Observable, from, of, throwError } from 'rxjs';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import firebaseClient from 'src/common/firebase';
import transformFirestoreResponse from 'src/common/firestore-response';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

type Products = Array<Product>;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  transformFirestoreResponse(
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

  async fetchProducts(): Promise<Observable<Products>> {
    const db = getFirestore(firebaseClient);
    const productsRef = collection(db, 'product');

    try {
      const productsSnap = await getDocs(productsRef);
      const transformedData = transformFirestoreResponse(productsSnap.docs);
      return of(transformedData);
    } catch (error) {
      console.error(error);
      return throwError(() => new Error(error as string));
    }
  }

  addProduct(
    product: Product
  ): Observable<DocumentReference<DocumentData, DocumentData>> {
    const db = getFirestore(firebaseClient);
    const productsRef = collection(db, 'product');

    try {
      const addProductPromise = addDoc(productsRef, product);
      return from(addProductPromise);
    } catch (error) {
      console.error(error);
      return throwError(() => new Error(error as string));
    }
  }
}
