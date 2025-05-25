import React, { useState } from "react";

export default function PackagesAndFaqs() {
  const [packages, setPackages] = useState([
    { name: "Basic Package", description: "Full day coverage", price: 25000 },
    { name: "Standard Package", description: "Full day coverage + Pre-wedding shoot", price: 50000 },
    { name: "Premium Package", description: "This is Luxury room", price: 3000 },
  ]);

  const [faqs, setFaqs] = useState([
    {
      question: "How far in advance should I book?",
      answer: "We recommend booking at least 6 months in advance for peak wedding season (October-February) and 3-4 months for off-season dates."
    },
    {
      question: "Do you travel to other cities?",
      answer: "Yes, we do! We cover all major cities in India. Travel and accommodation charges may apply for destinations outside Delhi NCR."
    }
  ]);

  const [newPackage, setNewPackage] = useState({ name: "", description: "", price: "" });
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });

  const addPackage = () => {
    if (newPackage.name && newPackage.price) {
      setPackages([...packages, { ...newPackage, price: Number(newPackage.price) }]);
      setNewPackage({ name: "", description: "", price: "" });
    }
  };

  const removePackage = (index) => {
    const updated = [...packages];
    updated.splice(index, 1);
    setPackages(updated);
  };

  const addFaq = () => {
    if (newFaq.question && newFaq.answer) {
      setFaqs([...faqs, newFaq]);
      setNewFaq({ question: "", answer: "" });
    }
  };

  return (
    <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Service Packages Section */}
      <div className="border rounded-lg p-4 shadow-sm">
        <h2 className="text-[14px] font-semibold mb-1 font-serif">Service Packages</h2>
        <p className="text-[14px] text-gray-500 mb-4">Define your service offerings and pricing</p>
        {packages.map((pkg, idx) => (
          <div key={idx} className="flex justify-between items-center border p-3 mb-2 rounded-lg">
            <div>
              <h3 className="font-[8px] font-serif">{pkg.name}</h3>
              <p className="text-sm text-gray-500">{pkg.description}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">₹{pkg.price.toLocaleString("en-IN")}</p>
              <button onClick={() => removePackage(idx)} className="text-white bg-red-500 px-3 py-1 rounded ml-2">Remove</button>
            </div>
          </div>
        ))}

        <div className="border-t pt-4 mt-4">
          <h3 className="font-medium mb-2 font-serif">Add New Package</h3>
          <input
            className="w-full mb-2 p-2 border rounded"
            placeholder="e.g., Premium"
            value={newPackage.name}
            onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
          />
          <input
            className="w-full mb-2 p-2 border rounded"
            placeholder="e.g., Full day coverage + Album"
            value={newPackage.description}
            onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
          />
          <input
            className="w-full mb-2 p-2 border rounded"
            placeholder="e.g., 25000"
            type="number"
            value={newPackage.price}
            onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
          />
          <button className="bg-[#0f4c81] text-white px-4 py-2 rounded" onClick={addPackage}>Add Package</button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="border rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-1 font-serif">Frequently Asked Questions</h2>
        <p className="text-sm text-gray-500 mb-4">Answer common client questions</p>
        {faqs.map((faq, index) => (
          <details key={index} className="mb-3">
            <summary className="cursor-pointer font-medium text-#0f4c81">{faq.question}</summary>
            <p className="text-sm mt-1 text-gray-700">{faq.answer}</p>
          </details>
        ))}

        <div className="border-t pt-4 mt-4">
          <h3 className="font-medium mb-2 font-serif">Add New FAQ</h3>
          <input
            className="w-full mb-2 p-2 border rounded"
            placeholder="e.g., Do you provide edited photos?"
            value={newFaq.question}
            onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
          />
          <textarea
            className="w-full mb-2 p-2 border rounded"
            placeholder="Your detailed answer..."
            rows={3}
            value={newFaq.answer}
            onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
          ></textarea>
          <button className="bg-[#0f4c81] text-white px-4 py-2 rounded" onClick={addFaq}>Add FAQ</button>
        </div>
      </div>
    </div>
  );
}

