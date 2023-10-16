import { initializeApp } from 'firebase/app';
import { Stripe, loadStripe} from '@stripe/stripe-js'

let stripeProimise: Stripe | null;

const initializeStripe = async () => {
    if (!stripeProimise){
        stripeProimise = await loadStripe(
            "pk_test_51NC5BXDIUrkNaf9dHkIeQvMAnF2zUG3W4JKq6U8hutlpG7GS6Gz2IY0O7VNYHzNZIRHAI96ekynuzHBawJgk5QPb00rrsgaFQG"
        )
    }
    return stripeProimise
}

export default initializeStripe