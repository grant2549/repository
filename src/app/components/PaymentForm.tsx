import { getFirestore, collection, addDoc, doc, onSnapshot } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'

const CheckoutPage = () => {
  const [sessionUrl, setSessionUrl] = useState<string | null>(null)

  useEffect(() => {
    const subscribeUser = async () => {
      const currentUser = auth.currentUser

      if (currentUser) {
        const usersCollection = collection(db, 'users')
        const checkoutSessionsCollection = collection(usersCollection, currentUser.uid, 'checkout_sessions')

        const docRef = await addDoc(checkoutSessionsCollection, {
          price: 'price_1NCCCvDIUrkNaf9dHMaPhjzl',  // replace with the price ID of the subscription plan
          success_url: window.location.origin,
          cancel_url: window.location.origin,
        })

        onSnapshot(doc(db, docRef.path), (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data()

            const { error, url } = data || { error: null, url: null }

            if (error) {
              alert(`An error occured: ${error.message}`)
            }

            if (url) {
              // We have a Stripe Checkout URL, let's redirect.
              setSessionUrl(url)
            }
          }
        })
      }
    }

    subscribeUser()
  }, [])

  if (sessionUrl) {
    window.location.assign(sessionUrl)
  }

  return (
    <div>
      Redirecting to Stripe Checkout...
    </div>
  )
}

export default CheckoutPage
