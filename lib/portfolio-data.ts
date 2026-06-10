export const portfolioData = {
  name: 'Keya Sheth',
  title: 'UI/UX Designer & Freelancer',
  
  hero: {
    greeting: 'Hi, I am',
    name: 'Keya Sheth',
    subtitle: 'UI/UX Designer & Freelancer',
    description: 'Creative UI/UX Designer and Freelancer passionate about crafting intuitive, user-centered, and visually engaging digital experiences. Skilled in Figma, wireframing, prototyping, responsive design, and modern UI principles.',
    skills: ['Figma', 'Wireframing', 'Prototyping', 'Responsive Design', 'User Research'],
  },

  about: {
    intro: 'Creative UI/UX Designer and Freelancer passionate about crafting intuitive, user-centered, and visually engaging digital experiences.',
    bio: 'Skilled in Figma, wireframing, prototyping, responsive design, and modern UI principles with hands-on experience designing real-world web and mobile applications. Experienced in collaborating with clients and developers to transform ideas into functional, accessible, and impactful digital products. Currently pursuing B.Tech in Computer Engineering with strong expertise in both design and frontend development.',
  },

  skills: [
    { 
      category: 'UI/UX Design', 
      items: ['UI Design', 'UX Design', 'Wireframing', 'Prototyping', 'User Flows', 'Design Systems', 'Responsive Design', 'Mobile-First Design', 'Interaction Design', 'Visual Hierarchy'],
      proficiency: 95
    },
    { 
      category: 'User Research', 
      items: ['User Research', 'Personas', 'Competitive Analysis', 'Usability Testing', 'Design Thinking'],
      proficiency: 85
    },
    { 
      category: 'Design Tools', 
      items: ['Figma', 'Canva', 'FigJam', 'Adobe Illustrator', 'Miro'],
      proficiency: 90
    },
    { 
      category: 'Frontend Knowledge', 
      items: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Tailwind CSS', 'Bootstrap'],
      proficiency: 80
    },
  ],

  designTools: [
    { name: 'Figma', logo: 'Figma', color: '#1ABCFE' },
    { name: 'Adobe XD', logo: 'XD', color: '#FF61F6' },
    { name: 'Adobe Illustrator', logo: 'AI', color: '#FF9B00' },
    { name: 'Canva', logo: 'Canva', color: '#00D4FF' },
    { name: 'FigJam', logo: 'FJ', color: '#1ABCFE' },
    { name: 'Miro', logo: 'Miro', color: '#FFD700' },
  ],

  otherSkills: [
    { name: 'Wireframing', icon: 'ðŸ“', category: 'Design' },
    { name: 'Prototyping', icon: 'ðŸ› ï¸', category: 'Design' },
    { name: 'UI/UX Design', icon: 'ðŸ–Œï¸', category: 'Design' },
    { name: 'User Research', icon: 'ðŸ”', category: 'Design' },
    { name: 'HTML', icon: 'ðŸ“„', category: 'Frontend' },
    { name: 'CSS', icon: 'ðŸŽ­', category: 'Frontend' },
    { name: 'JavaScript', icon: 'âœ¨', category: 'Frontend' },
    { name: 'React', icon: 'âš›ï¸', category: 'Frontend' },
    { name: 'Tailwind CSS', icon: 'ðŸ’¨', category: 'Frontend' },
    { name: 'Bootstrap', icon: 'ðŸ“¦', category: 'Frontend' },
  ],

  projects: [
    {
      id: 1,
      title: 'E-Learning Platform',
      category: 'UI/UX',
      description: 'Designed a modern web-based learning platform with intuitive dashboards, progress tracking, and responsive course flows',
      fullDescription: 'The E-Learning Platform is a modern web-based learning solution designed to create a seamless and engaging educational experience for students. The project focused on simplifying online learning through clean navigation, organized dashboards, and intuitive user flows. The platform includes a responsive landing page, student dashboard, progress tracking system, and pending courses section to help users manage their learning journey efficiently. The design was created with a user-centered approach, ensuring accessibility, clarity, and smooth interaction across different sections of the platform. Using Figma, the interface was designed with modern card-based layouts, structured information hierarchy, and visually engaging components to enhance usability and improve the overall learning experience.',
      image: '/e-learning-1.png',
      images: ['/e-learning-2.png', '/e-learning-3.png', '/e-learning-4.png'],
      year: 2025,
      tags: ['Figma', 'UI/UX', 'Educational'],
      role: 'Lead UI/UX Designer',
      tools: ['Figma', 'FigJam', 'Adobe Illustrator'],
      outcome: 'The final outcome successfully delivered a clean, modern, and highly functional learning platform interface that improved usability and course accessibility for users. The dashboard design enabled students to easily monitor their progress, continue pending courses, and navigate through learning resources without confusion. The use of responsive layouts, visual progress indicators, and organized content structure enhanced user engagement and created a more interactive digital learning experience. This project strengthened skills in UI/UX design, dashboard design, responsive design, user flow planning, and visual hierarchy while demonstrating the ability to transform complex educational workflows into intuitive and user-friendly interfaces.',
    },
    {
      id: 2,
      title: 'Tailoring Management App',
      category: 'UI/UX',
      description: 'Designed a mobile tailoring management app focused on order tracking, customer handling, and workflow efficiency',
      fullDescription: 'The Tailoring Management Application is a mobile UI/UX design project created to simplify order management and customer handling for tailoring businesses. The application was designed with a modern, clean, and highly functional interface focused on improving workflow efficiency for tailors and shop owners. The platform allows users to manage customer details, track garment orders, monitor stitching progress, and store measurement records in an organized way. The design includes multiple screens such as dashboard management, customer orders, order status tracking, and garment measurement details, all built with a user-centered approach to ensure smooth navigation and quick accessibility. Using Figma, the interface was designed with intuitive layouts, card-based sections, visual status indicators, and responsive mobile-friendly components to create a seamless user experience for daily tailoring operations.',
      image: '/tailoring-1.png',
      images: ['/tailoring-2.png', '/tailoring-3.png', '/tailoring-4.png'],
      year: 2025,
      tags: ['Figma', 'Mobile UI', 'Workflow'],
      role: 'UI/UX Design Intern',
      tools: ['Figma', 'Wireframing', 'Prototyping'],
      outcome: 'The final outcome delivered a clean and efficient tailoring management interface that simplified complex tailoring workflows into an easy-to-use digital experience. The application improved usability by allowing users to quickly access customer information, manage active orders, update order progress, and maintain garment measurements through a structured and visually organized interface. Features like status indicators, categorized orders, and dashboard summaries enhanced workflow visibility and reduced manual tracking complexity. The project strengthened skills in mobile UI design, dashboard design, workflow planning, information hierarchy, and user-centered problem solving while demonstrating the ability to design practical business-oriented digital solutions with modern and accessible UI principles.',
    },
    {
      id: 3,
      title: 'E-Commerce Store Design',
      category: 'UI/UX',
      description: 'Designed a mobile e-commerce shopping app with intuitive product browsing, detail views, cart flow, and checkout experience',
      fullDescription: 'The E-Commerce Store Design is a mobile UI/UX project designed to create a seamless and engaging online shopping experience for users. The platform focuses on providing a clean, visually appealing, and easy-to-navigate interface for browsing products, exploring categories, viewing detailed product information, and completing purchases efficiently. The application includes multiple screens such as product listings, product detail pages, shopping cart, order summary, and personalized recommendation sections to enhance the overall shopping journey. Designed using Figma, the interface combines modern layouts, intuitive navigation, organized product cards, and responsive mobile-first components to ensure a smooth and user-friendly experience across the platform.',
      image: '/ecommerce-1.png',
      images: ['/ecommerce-2.png', '/ecommerce-3.png', '/ecommerce-4.png'],
      year: 2024,
      tags: ['Figma', 'E-Commerce', 'Mobile UI'],
      role: 'UI/UX Designer',
      tools: ['Figma', 'Wireframing', 'Prototyping'],
      outcome: 'The final outcome successfully delivered a modern and visually engaging e-commerce interface that improved product discoverability, shopping flow, and overall user interaction. Features like categorized product sections, clean product detail pages, personalized recommendations, and simplified checkout experience enhanced usability and reduced user effort during shopping. The use of structured layouts, visual hierarchy, and organized information helped create a more intuitive and accessible user journey. This project strengthened skills in mobile UI design, e-commerce UX strategy, product presentation, interaction design, responsive design, and user-centered problem solving while demonstrating the ability to design functional and aesthetically balanced digital shopping experiences.',
    },
    {
      id: 4,
      title: 'Quizzo â€“ Quiz App',
      category: 'UI/UX',
      description: 'Designed a gamified mobile quiz app with onboarding, category exploration, social features, and leaderboard-based learning',
      fullDescription: 'The Quizzo Quiz Application is a mobile UI/UX design project created to make online learning more interactive, engaging, and enjoyable for users through gamified quiz experiences. The application was designed with a modern and playful interface focused on improving user engagement, quiz participation, and social interaction among learners. The platform includes onboarding screens, user role selection, quiz discovery pages, leaderboard sections, category-based learning, friend connections, and top author recommendations to create a dynamic and community-driven learning experience. Designed using Figma, the interface combines vibrant visuals, intuitive navigation, interactive cards, and user-friendly layouts to deliver a seamless mobile learning experience while maintaining visual consistency and accessibility across all screens.',
      image: '/quizzo-1.png',
      images: ['/quizzo-2.png', '/quizzo-3.png', '/quizzo-4.png', '/quizzo-5.png', '/quizzo-6.png'],
      year: 2024,
      tags: ['Figma', 'Mobile UI', 'Gamification'],
      role: 'Mobile UI Designer',
      tools: ['Figma', 'Prototyping', 'Wireframing'],
      outcome: 'The final outcome successfully delivered a visually engaging and user-friendly quiz application that enhanced learning interaction through gamification and social engagement features. The design improved usability by simplifying quiz discovery, category navigation, friend connectivity, and leaderboard participation within a clean and organized interface. Features such as colorful onboarding flows, interactive quiz cards, user profiles, and category-based learning sections created a more immersive and motivating experience for users. This project strengthened skills in mobile UI design, gamified UX strategy, onboarding experience design, interaction design, visual hierarchy, and user-centered problem solving while demonstrating the ability to design engaging educational experiences with modern and accessible UI principles.',
    },
    {
      id: 5,
      title: 'Freelance Desk UI Design',
      category: 'UI/UX',
      description: 'Designed a freelance platform with dashboard views, project discovery, messaging, file management, and payment tracking',
      fullDescription: 'Freelance Desk is a freelance marketplace UI/UX project designed to bring project discovery, collaboration, and account management into one clear digital workspace. The design focuses on helping freelancers and clients move smoothly across the core product experience through structured dashboards, available project listings, direct messaging, payment and invoice tracking, and shared file management. Designed in Figma, the interface was built with clean layouts, soft visual hierarchy, card-based organization, and role-focused actions so users can quickly understand what to do next in each part of the platform. The overall direction balances a modern SaaS-style aesthetic with practical workflow clarity, making the experience feel professional, organized, and easy to use across all major screens.',
      image: '/freelancedesk-1.png',
      images: ['/freelancedesk-2.png', '/freelancedesk-3.png', '/freelancedesk-4.png', '/freelancedesk-5.png'],
      year: 2026,
      tags: ['Figma', 'Marketplace', 'UI Design'],
      role: 'UI/UX Designer',
      tools: ['Figma', 'Wireframing', 'Prototyping'],
      outcome: 'The final outcome delivered a polished freelance platform concept that turns several important workflows into a cohesive, easy-to-navigate product experience. Screens for the main dashboard, available projects, messaging, invoices, and shared files work together through consistent spacing, reusable cards, and clear visual grouping, helping users manage work without feeling overwhelmed. The design improves usability by surfacing the most important actions quickly, keeping status information readable, and making cross-section movement feel natural and predictable. This project strengthened skills in marketplace UX strategy, dashboard design, SaaS interface planning, information hierarchy, and workflow-based problem solving while demonstrating the ability to design a multi-screen product system with strong visual consistency.',
    },
  ],

  experience: [
    {
      role: 'Freelance UI/UX Designer',
      company: 'Self-Employed',
      duration: '2025 - Present',
      location: 'Remote',
      description: 'Designed banners, social media creatives, and modern UI layouts for clients and personal projects. Created mobile app screens and responsive user interfaces using Figma and Canva.',
    },
    {
      role: 'UI/UX Design Intern',
      company: 'Ample Infotech',
      duration: 'Dec 2025 - Apr 2026',
      location: 'On-site',
      description: 'Designed a Tailoring Management Application focused on workflow management and seamless user experience. Created wireframes, user flows, responsive screens, and interactive prototypes using Figma.',
    },
    {
      role: 'UI/UX Designer Intern',
      company: 'Zidio Development',
      duration: 'Apr 2025 - May 2025',
      location: 'Remote',
      description: 'Designed educational platform interfaces with responsive layouts and intuitive user experiences using Figma. Focused on accessibility, usability, and modern UI design principles.',
    },
    {
      role: 'React.js Intern',
      company: 'Tech Elecon Pvt. Ltd.',
      duration: 'May 2025 - Jun 2025',
      location: 'Hybrid',
      description: 'Developed responsive landing pages using React.js, Tailwind CSS, and reusable UI components.',
    },
  ],

  certifications: [
    {
      title: 'Code Unnati SAP Certification',
      issuer: 'SAP',
      year: 2024,
    },
    {
      title: 'Principles of UX/UI Design',
      issuer: 'Coursera',
      year: 2024,
    },
    {
      title: 'SQL',
      issuer: 'Coursera',
      year: 2024,
    },
    {
      title: 'Project Planning',
      issuer: 'Coursera',
      year: 2024,
    },
    {
      title: 'Gen AI Study Jam 2024',
      issuer: 'Google Cloud',
      year: 2024,
    },
  ],

  education: [
    {
      school: 'Madhuben And Bhanubhai Institute of Technology',
      degree: 'B.Tech in Computer Engineering',
      cgpa: '8.42/10',
      duration: '2022 â€“ 2026',
      location: 'Anand, Gujarat',
    },
  ],

  contact: {
    email: 'keyapsheth@gmail.com',
    phone: '+91-8160321663',
    location: 'Anand, Gujarat',
    availability: 'Open for job opportunities',
    social: [
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/keya2612/' },
      { platform: 'GitHub', url: 'https://github.com/Keya2612' },
      { platform: 'Email', url: 'mailto:keyapsheth@gmail.com' },
    ],
  },
};
