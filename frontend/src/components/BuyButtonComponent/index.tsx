import * as React from 'react';

// Declaración del componente stripe-buy-button para TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-buy-button': any;
    }
  }
}

const BuyButtonComponent: React.FC = () => {
  return (
    <div>
            
            <stripe-buy-button
  buy-button-id="buy_btn_1PlGXNF4dggJlnFTw0NbZhoH"
  publishable-key="pk_test_51PlAEoF4dggJlnFTJSO3PsVP1iWZkA58MnMBe5QgyDXRsTYIcvsN9fZZPYgByqHgxsB7Bw1Q7sKeAmCYg4hKV1EA00ZqwKlWRq"
>
    Checkout
</stripe-buy-button>
        
    </div>
  )
}

export default BuyButtonComponent;
