import React from 'react';

const FaqQuestions = () => {
  return (
    <div className="bg-white p-2 md:p-10 rounded-lg shadow-sm text-gray-800 font-serif">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">Frequently Asked Questions</h2>

      <div className="space-y-6 text-base leading-relaxed">
        <div>
          <h3 className="font-semibold text-lg">How far in advance should I book?</h3>
          <p>
            We recommend booking at least 6–8 months in advance for wedding dates during peak season (October–February). For other months, 3–4 months in advance is usually sufficient.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg">How many photos will I receive?</h3>
          <p>
            The number of photos depends on your package. Our basic package includes 100 edited photos, premium offers 300, and deluxe provides 500+. All photos are professionally edited and delivered in high resolution.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg">Do you travel to other cities?</h3>
          <p>
            Yes, we are available for destination weddings across India and internationally. Travel and accommodation charges apply for locations outside Delhi NCR.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg">What is your payment policy?</h3>
          <p>
            We require a 30% advance booking fee to reserve your date, with the balance payable one week before the event. We accept bank transfers, credit/debit cards, and UPI payments.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg">How long until we receive our photos?</h3>
          <p>
            You’ll receive a preview of selected photos within a week after the event. The complete set of edited photos is typically delivered within 3–4 weeks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FaqQuestions;
