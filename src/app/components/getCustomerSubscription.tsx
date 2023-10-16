import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import Stripe from 'stripe';
const stripe = new Stripe('your-stripe-secret-key', { apiVersion: '2022-11-15' });


admin.initializeApp();

export const checkSubscription = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
    // Get the user ID from the context
    const uid = context.auth?.uid;

    if (!uid) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to check subscription.');
    }

    // Retrieve the user document from Firestore
    const userDoc = await admin.firestore().collection('users').doc(uid).get();
    const userData = userDoc.data();

    // Ensure the user document has a stripeCustomerId field
    if (!userData || !userData.stripeCustomerId) {
        throw new functions.https.HttpsError(
            'failed-precondition', 
            'This user does not have an associated Stripe Customer ID.'
        );
    }

    // Retrieve the Stripe Customer
    const customer = await stripe.customers.retrieve(userData.stripeCustomerId);

    // Check if the customer is deleted
    if ('deleted' in customer && customer.deleted) {
      throw new functions.https.HttpsError(
        'not-found', 
        'The associated Stripe Customer has been deleted.'
      );
    }

    // Check the status of the first subscription
    const subscription = customer.subscriptions?.data[0];
    if (!subscription) {
        throw new functions.https.HttpsError(
            'not-found', 
            'This user does not have a subscription.'
        );
    }

    // Return the status to the client
    return { status: subscription.status };
});
