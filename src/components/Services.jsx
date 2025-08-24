import React from 'react';

/**
 * A professional component showcasing the hospital's key services
 * in a responsive grid of cards.
 */
const App = () => {
  // Define the service data. Each object contains the icon, title, description, and link.
  const services = [
    {
      title: 'Emergency Care',
      description: 'Our emergency department is open 24/7 to provide immediate, life-saving care for all critical conditions.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-[#074351]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-10.5a1.5 1.5 0 011.5 0l4.5 4.5a1.5 1.5 0 010 1.5L7.5 20.25m-3.75-6.75h-2.25m2.25 0a4.5 4.5 0 01-1.5-2.25m3.75 2.25a4.5 4.5 0 00-1.5-2.25m3.75 2.25h1.5m-1.5 0a4.5 4.5 0 011.5-2.25m3.75 2.25h1.5m-1.5 0a4.5 4.5 0 001.5-2.25m3.75 2.25c1.125 0 2.25-.343 2.25-1.5s-.343-2.25-1.5-2.25m-3.75 2.25h-1.5m1.5 0a4.5 4.5 0 01-1.5-2.25m3.75 2.25h1.5m-1.5 0a4.5 4.5 0 001.5-2.25m-3.75-2.25a4.5 4.5 0 011.5-2.25m3.75 2.25h1.5" />
        </svg>
      ),
      link: '/emergency',
    },
    {
      title: 'Pediatric Care',
      description: 'Our compassionate pediatric specialists provide comprehensive and gentle care for children of all ages, from infants to teens.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-[#074351]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l-3.375 3.375c-.39.39-.39 1.023 0 1.414l3.375 3.375c.39.39 1.023.39 1.414 0l3.375-3.375c.39-.39.39-1.023 0-1.414l-3.375-3.375a1.5 1.5 0 00-1.414 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 10.5a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5zM12.75 10.5a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5zM15 7.5a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5zM7.5 7.5a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5z" />
        </svg>
      ),
      link: '/pediatrics',
    },
    {
      title: 'Maternity Services',
      description: 'Our dedicated team provides complete care for mothers and newborns, from prenatal consultations to a supportive delivery.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-[#074351]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 009-9H3a9 9 0 009 9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-14" />
        </svg>
      ),
      link: '/maternity',
    },
    {
      title: 'General Surgery',
      description: 'From routine procedures to complex operations, our surgical team uses advanced techniques for a safe and effective outcome.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-[#074351]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15M12 4.5v15" />
        </svg>
      ),
      link: '/surgery',
    },
    {
      title: 'Rehabilitation',
      description: 'Our physical and occupational therapists work with you to regain strength and mobility, helping you return to your daily life.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-[#074351]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.5l-6-6-6 6M12 12l6-6 6 6" />
        </svg>
      ),
      link: '/rehabilitation',
    },
    {
      title: 'Cardiology',
      description: 'We offer a full range of heart-related services, from diagnostic testing and preventative care to advanced treatment plans.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-[#074351]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.34 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c2.34 0 4.34 1.15 5.5 2.97C14.16 4.15 16.16 3 18.5 3 21.58 3 24 5.42 24 8.5c0 3.78-3.4 6.84-8.55 11.53L12 21.35z" />
        </svg>
      ),
      link: '/cardiology',
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
              <div className="flex items-center justify-center p-4 bg-gray-100 rounded-full mb-6">
                {service.icon}
              </div>
              <h3 className="text-2xl font-semibold text-[#074351] mb-4">{service.title}</h3>
              <p className="text-gray-500 mb-6">{service.description}</p>
              <a
                href={service.link}
                className="inline-block mt-auto px-6 py-3 border border-[#074351] text-[#074351] font-semibold rounded-full hover:bg-[#074351] hover:text-white transition-colors duration-300"
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
