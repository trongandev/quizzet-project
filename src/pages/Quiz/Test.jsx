import React from "react";
import { addDoc, collection, getFirestore } from "firebase/firestore";

export default function Test() {
    const handleSubmit = (e) => {
        e.preventDefault();

        const db = getFirestore();
        const pushData = async () => {
            try {
                const docRef = await addDoc(collection(db, "users"), {
                    first: "Alan",
                    middle: "Mathison",
                    last: "Turing",
                    born: 1912,
                });

                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        };
        pushData();
    };
    return (
        <div>
            <form action="" method="post" onSubmit={handleSubmit}>
                <input type="text" name="name" id="name" />
                <input type="submit" value="submit" className="bg-red-200 font-bold text-red-500 mt-3" />
            </form>
        </div>
    );
}
