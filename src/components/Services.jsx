import React from 'react';

/**
 * A professional component showcasing the hospital's key services
 * in a responsive grid of cards.
 */
const App = () => {
  // Define the service data. Each object contains the icon, title, description, and link.
  const services = [
    {
      title: 'Medical Services',
      description: 'Our dedicated medical team provides comprehensive general and specialized medical care to address all your health concerns.',
      
      link: '/medical',
    },
    {
      title: 'General Surgery',
      description: 'From routine procedures to complex operations, our surgical team uses advanced techniques for a safe and effective outcome.',
      
      link: '/surgery',
    },
    {
      title: 'Diagnostics',
      description: 'We offer a full range of diagnostic services, including lab testing and imaging, to ensure accurate and timely diagnoses.',
      
      link: '/diagnostics',
    },
    {
      title: 'Pharmaceutical',
      description: 'Our hospital pharmacy provides quick and easy access to a wide range of medications, ensuring you get the prescriptions you need.',
      
      link: '/pharmacy',
    },
    {
      title: 'Maternity Services',
      description: 'Our dedicated team provides complete care for mothers and newborns, from prenatal consultations to a supportive delivery.',
      
      link: '/maternity',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#074351] mb-4">Our Comprehensive Services</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We are committed to providing the highest quality healthcare with compassion and excellence. Explore our wide range of services designed to meet all your family's health needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300"
            >
              
              <h3 className="text-2xl font-semibold text-[#0185ff] mb-4">{service.title}</h3>
              <p className="text-gray-500 mb-6">{service.description}</p>
              <a
                href={service.link}
                className="btn-primary"
              >
                Learn More
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default App;
