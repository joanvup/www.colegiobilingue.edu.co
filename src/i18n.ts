import { useState, useEffect, createContext, useContext, ReactNode } from "react";

export type Language = "EN" | "ES";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const translations = {
  EN: {
    nav: {
      home: "Home",
      aboutUs: "About Us",
      history: "History",
      missionVision: "Mission & Vision",
      quality: "Quality Policy & Objectives",
      teacherProfile: "Teacher Profile",
      studentProfile: "Student Profile",
      theSchool: "The School",
      preschool: "Preschool",
      primary: "Primary",
      highSchool: "High School",
      symbols: "Institutional Symbols",
      handbook: "Student Handbook",
      admissions: "Admissions",
      contact: "Contact Us",
      virtualTour: "Virtual Tour",
      schedule: "Schedule a Visit",
      apply: "Apply Now",
      calendar: "Calendar",
      gallery: "Gallery",
      galleryTitle: "Photo Gallery",
      gallerySubtitle: "Moments of learning, sports, and community at Colegio Bilingüe.",
      galleryNoImages: "No images found in this album.",
      galleryLoading: "Loading gallery...",
      galleryClose: "Close",
      galleryAlbums: "Albums",
    },
    hero: {
      title: "Human Quality and Social Commitment",
      subtitle: "Fundación Colegio Bilingüe de Valledupar",
      tagline: "Forming bilingual global leaders with solid ethical principles since 1980.",
      ctaPrimary: "Admissions 2026-2027",
      ctaSecondary: "Explore Our Campus",
    },
    history: {
      title: "Our History",
      subtitle: "A legacy of bilingual excellence and community leadership in Valledupar.",
      foundingTitle: "The Genesis (1979 - 1980)",
      foundingText1: "In the year 1979, the nonprofit foundation was established, the constitutional record was signed in the Casa de la Cultura Cecilia Caballero de Lopez, on May 7th 1979. The legal status is obtained and was issued by the National Ministry of Education of Colombia through the resolution N° 15283 on September 6th 1979.",
      foundingText2: "In the 1970’s, during the times of the cotton boom, this region was frequently visited by the merchant Gustavo Grauard, exporter of cotton to England. In 1979, he came to Valledupar accompanied by the principal and the vice principal of Parrish school Mr. Shepherd and Mr. Wagner. They brought with them an idea to start a bilingual school in Valledupar.",
      foundingText3: "At first the idea didn´t have much reception, but as they came back they met Alonso Sanchez Mejía, they communicated the idea to him and he told them that the only person that would pay attention was the engineer Julio Villazón Baquero, who was later informed, and who embraced and was dedicated to crystallize this idea; he begged them to postpone their journey back home. Meanwhile he made an announcement on the radio station Radio Guatapurí calling upon parents who might be interested.",
      foundingFamilies: "The First Meeting & The Seven Founding Families",
      foundingFamiliesIntro: "The first meeting had just fourteen people attend, representing the founding families of the school. The seven families were led by:",
      families: [
        "Julio Villazón Baquero – Doris Castro de Villazón",
        "Alvaro Castro Socarrás – Leonor Palmera de Castro",
        "José Joaquín Sandoval – Dilia Pinto Araújo",
        "Edgardo Cuello Fernández – Beatriz Lacouture de Cuello",
        "Orlando Rois – Alida Gnecco de Rois",
        "Rubén Ortiz Martínez – Georgina de Ortiz",
        "Rodolfo Maestre Pavajeau – Letty Ariza de Maestre"
      ],
      expansionTitle: "Consolidating the Vision",
      expansionText1: "In the 1970s, in the time of the great cotton boom, the merchant Gustavo Graubard would frequent the region to export cotton to England. In 1979, he came to Valledupar accompanied by the rector and vice rector, Mr. Shepherd and Mr. Wagner respectively, of the Colegio Parrish. They brought with them the idea to create a bilingual school in Valledupar. At first, it did not catch on, but upon returning, they encountered Alfonso Sanchez Mejia. They explained their idea and mister Sanchez stated that the only person that would pay attention to this idea was the engineer Julio Villazon Baquero. They went to look for him and he immediately welcomed them and set out to accomplish this idea. He begged the rectors to postpone their return trip as he put out an announcement on the local radio station Radio Guatapuri looking for parents interested in such an idea.",
      expansionText2: "He met with Mr. Shepherd and Mr. Wagner for the next 10 days in a meeting that managed to summon 50 people and began enrollment in the school at a cost of $1000 per student. They decided to meet again. In the second meeting, they tried to enroll 118 parents, and increased the amount to $20,000 per student. The beginning of this project was first organized under the direction of Shepherd and Wagner, with the rector as Victor More, who signed Colombian and North American professors.",
      expansionText3: "The 28th of January in the year 1980 officially began the initial works for the Fundacion Colegio Bilingue de Valledupar. As a result of innumerous efforts led by the mister Julio Villazon Baquero, who finally achieved the binding around this idea in the founding of this non-profit, with the objective to offer teachings of high quality and of bilingual character in both English and Spanish, in which, simultaneously, with academic rigor, would form citizens of stable ethic principle, committed to their social context.",
      academicYearTitle: "The First Academic Steps",
      academicText1: "In August of that same year, invoking the Calendar B school year, Colegio Bilingue began its first academic year. Beginning with 15 teachers and 138 students in the preschool, primary, and first two grades of high school, and as General Director Raymon Scheffer, who served as such until 1981, after who was replaced by Mr. David J. Barry (r.i.p.). Mr Barry was in charge until June of 1985, in which date he returned to his home country. During the first three years, the school worked provisionally at the Universidad Popular del Cesar (Parque Lineal Hurtado), and from the first of August 1984, moved to the current location in the north side of Valledupar, in a lot of more than 60 acres, where it has continued to develop into the physical structure that requires an educational institution as was designed by its founders.",
      academicText2: "The Director Barry, was replaced by the Academic Director Ricardo Spinel. Later, the school was placed under the care of General Director Mr. Alastair Turton and who later gave over sub-directorship to the Miss Rocio Ospino de Saade. Since 2009 Mrs. María Doris Villazón started as Subdirector and since 2011 she became General and Administrative Director. The Academic Headmistress is the psychologist Cecilia Restrepo R, since 2012.",
      academicText3: "The school holds more than 70 recognized educational professionals to attend a total of 750 students in levels of preschool, elementary, and high school. It is legally authorized by the National Ministry of Education through the Resolution No. 000928 on April 3rd of 2013 from the Municipal Secretary of Education to offer formal teaching in the aforementioned levels and in the academic modality of bilingualism (English and Spanish). The high school diploma is issued in an academic modality in the terms of the Resolution No. 00059 from April 8th, 2010.",
      academicText4: "As a non-profit organization, the school is directed by a Board of Directors that establishes directives and general politics for the Foundation, supervising the execution and carrying out of principles by its own philosophy. It has been chaired since its founding by the Honorable Julio Villazon Baquero. The Foundation Colegio Bilingue of Valledupar in its working years, has cons become a locally oriented paradigm for training citizens who have had to assume the leadership required for our country."
    },
    missionVision: {
      title: "Philosophy & Leadership",
      subtitle: "Our institutional pillars guiding the future of our students.",
      mission: {
        title: "Mission",
        text: "Fundación Colegio Bilingüe de Valledupar is committed in providing excellent bilingual education, which follows a comprehensive teaching learning process in which the objective is to prepare citizens based on core values such as respect, honesty, and service to the community; leaders who follow ethical principles and exhibit solidarity. Lifelong learners who will benefit humanity in this challenging, multicultural and technologically advanced world."
      },
      vision: {
        title: "Vision",
        text: "By 2030, Fundación Colegio Bilingüe de Valledupar will continue being acknowledged as an excellent school which offers bilingual education, following a globalized perspective based on cutting edge educational and technological trends. The school’s goal is to develop ethical leaders who promote solidarity and will benefit humanity. Furthermore, to be an institution accredited by Cognia, and certified by ISO 9001:2015."
      }
    },
    quality: {
      title: "Quality Policy & Objectives",
      subtitle: "Our absolute commitment to educational rigor and continuous improvement.",
      policyTitle: "Quality Policy",
      policyText1: "The Fundación Colegio Bilingüe de Valledupar for 35 years has been forming people with the ability to act by personal conviction, think critically, and assume responsibilities that require applying values like ethics and respect for rules. Also, students and graduates from the institution, thanks to their excellent academic formation and values, are capable to answer to the challenges that life brings and form solutions.",
      policyText2: "For this reason, the Fundación Colegio Bilingüe de Valledupar is proud to see its former students reach every single one of their achievements, like Alejandra Araujo Gutierrez, a student who graduated in 2014-2015, who received the 17th position nationally in the state exam with the average score of 422 points. Our student, Jose Luis Martinez Cadavid, also deserves a round of applause for obtaining the Orgullo Caribe Scholarship from the Universidad del Norte in the Systems Engineering program, which is the most important scholarship in the Atlantic coast.",
      objectivesTitle: "Quality Objectives",
      objectives: [
        "Ensure a bilingual academic excellence that allows us to maintain high levels of competence in internal and external testing.",
        "Ensure effective collaboration between the school, student, parents and community where the values of respect, honesty and service predominate.",
        "Develop talents in different sports and artistic disciplines by increasing the level of competitiveness in students.",
        "Keep positioning and expected financial stability.",
        "Provide and maintain the infrastructure needed to achieve conformity with the requirements of the service.",
        "Maintain the organizational climate and staff skills within a continuous improvement approach."
      ]
    },
    profiles: {
      title: "The Bilingüista Profiles",
      subtitle: "The distinct virtues and characteristics defining our educational community.",
      teacher: {
        title: "Profile of the Bilingüista Teacher",
        intro: "Among the principles, Policy and Quality Objectives of the Fundación Colegio Bilingüe de Valledupar its intended that the bilingüista teacher is an innovative educator and researcher, a change agent, who has a passion for teaching and through the development of their talents, wishes to form new leaders in the region and the country.",
        points: [
          "Must have the decent standards, standing out for their good manners, good personal presentation. Respectful, honest, with sense of service and of belonging to the institution.",
          "Is a complete person. Empathetic, responsible, punctual, committed, tolerant, understanding and solidary; ethical, spiritual and has humanistic principles.",
          "They must be a persevering leader in their goals, achievement-oriented, effective communicator with ability to discuss and solve problems.",
          "Analytical, critical and creative thinker; facilitator of meaningful, individual and cooperative learning. Concerned about your personal and professional development.",
          "Producer of quality, oriented by the capacity for teamwork, apprentice of and for life.",
          "Makes every day something new and positive to their advantage, their team, their school and society.",
          "Lives happy for the greatness of their dreams, their respect for life, for the truth they profess, the values they conquer and the destiny that they forge."
        ]
      },
      student: {
        title: "Profile of the Bilingüista Student",
        intro: "Among the principles, Policy and Quality Objectives of Bilingual College of Valledupar, Foundation, the bilingual student will be the protagonist of his or her learning, with initiative, common sense, analytical, critical and creative thinking; the internalization of values such as respect, honesty and service to the community allow them to be responsible, committed and caring citizens; guided by the ability to discuss and solve problems. That self-direction, effort, perseverance, motivation and teamwork enable them to train as leaders capable of achieving welfare and excellence for their lives through the development of their talents within a multicultural, pluralistic and technologically advanced society.",
        points: [
          "Must have good manners. They must be known for their good manners, superb personal presentation and positive attitude.",
          "Has with pride their uniform as a symbol of belonging to the institution.",
          "Is the best child, best friend now, to be the best parent and better citizen tomorrow.",
          "Has integrity, empathy, respects differences, tolerance, and is comprehensive.",
          "Begins each day new and positive for the benefit of themselves, their family, the school, and society.",
          "Never uses force, whose weapons will always be reason, common sense, honesty, and dialogue to find solutions to problems.",
          "Lives happily under the greatness of their dreams, the respect they feel for life, for the truth that they speak, and the values that they take with them, and the destiny that they forge.",
          "Makes studying their course, freedom and justice their only desire.",
          "Is prepared to work for a country that they love, Colombia, and fight for its social, cultural, and economic liberty.",
          "Works together and enthusiastically in civic, social, and cultural activities because they are a virtuous young person that understand the needs of others."
        ]
      }
    },
    school: {
      title: "Academic Levels & Campus Life",
      subtitle: "A holistic educational experience from early years to university readiness.",
      preschool: {
        title: "Preschool",
        desc: "While forming our preschoolers, we understand that the different areas of development function together integrally, socially, cognitively, and using base motor skills to form successful children and students. We know that the best way to knowledge is with activities that help with the development of creative thought, and to understand their environment with fresh air in the school park. We finish up the day with complementary academic programs in Spanish, Math, English, and Science.",
        valuesTitle: "Values Program",
        valuesDesc: "In order to form behavior guided by values and virtues, the purpose of the program is for an affective partnership. Behind each story, song, dance, drawing, and analysis, the student learns, explores, and evolves abilities that will help in the social integration in an effective way and confront their own emotions.",
        centerTitle: "Learning Center",
        centerDesc: "This is an afterschool support system to give help to the kids that require reinforcement of content, whether that be in English, Spanish, in reading or writing, or Mathematics. It is given at varying times throughout the year, with the previous needs observed.",
        readingTitle: "Plan Lector: Tell me a story",
        readingDesc: "This is meant to reinforce reading and writing skills in English and Spanish. It is an opportunity to enter a world full of imagination that enriches vocabulary as much as possible in the preschool children. The intention of the process is basically social, to manifest needs and amplify the social nucleus which later advances in the acquisition of writing in Kinder and Transition.",
        activitiesTitle: "Enrichment & Tradition",
        activitiesDesc: "The preschoolers have the opportunity to develop skills not only in the normal spaces that they find during the school day, such as sports and art, but also to participate in swimming, football camp, afterschool tennis, and the Folklore Festival in April, which helps to enrich life in preschool. They also are able to enjoy Children’s Day, Love and Friendship, Novena, and the Christmas Show, Language Day, Holy Week, Family Day, Inter-house Competitions, assemblies, the academic design, and social norms.",
        teamTitle: "Our Dedicated Team",
        teamDesc: "For the development of everything aforementioned, with an awesome team conformed of a coordinator, school representative (parents and former students), two teachers in the classroom, in preschool there is an additional helper, sport and swimming instructor, and art teacher, who always will be accompanied by the main teacher. We also can count on the school nurse and lifeguard.",
        comfortsTitle: "Like Home",
        comfortsDesc: "The student’s day has all of the comforts of home in order to make this transition easier for the little students."
      },
      primary: {
        title: "Primary School",
        desc1: "The values that positively contribute to the personal enrichments and allows us to find reasons for our actions are to make decisions and resolve problems. This must be done from a very young age. This has been the primary objective of the primary team: to improve the academic performance of the boys and girls, we are conscious that healthy relations between disciplined children makes for a better academic environment.",
        desc2: "For this reason, during this year we will continuing reinforcing the Value Program, developing activities like Person of the Week, holding assemblies where we will talk about values and celebrate special dates, each grade will be assigned an animal with a value represented, and play traditional games during recess with the understanding that the games help to establish interpersonal relationships. We know that the boys and girls of primary are very happy enjoying themselves in their new park.",
        mottoTitle: "Our Motto in Action",
        mottoDesc: "Working coherently with the Value Program, and with our beautiful motto “Human Quality and Social Commitment”, we continue with the social program that we call “My Life, My World”, sponsoring different foundations that are dedicated to help better the quality of life for many homeless and needy children around the city.",
        teamworkTitle: "Teamwork & Compassion",
        teamworkDesc: "Working as a team, by grade, our kids are active participants in different playful, cultural, and educational activities with the collection of clothes, toys, books, food and etc. in a way that reflects mutual help, where we make our kids become united human beings, more committed to a dignified life and a better world.",
        ecologyTitle: "Ecology Project",
        ecologyDesc: "Other programs executed in our section include the successful “Ecology Project” where the children constantly are receiving educational talks about taking care of our natural resources whilst giving special importance to the reuse of disposable plastic bottles used throughout the college. These bottles are later used for decoration, costumes, wallets, Christmas gifts, toys, among other things. As both a close to the project and price, the students of primary are taken to the Escuela Ambiental de Valledupar to both explore the space and interact with the environment.",
        homeTitle: "Family Ties & Academic Excellence",
        homeDesc: "As a result of the Value Program, it was noticed that one of the factors that most effects academic performance of the children is the atmosphere at home. For this reason, we will continue supporting the appropriate family ties towards person of the week, where students will go home with their poster and corresponding value and work with their families. Later on, the student will share his or her work with their classmates and all the work that they did.",
        saberTitle: "Pruebas Saber 3° & 5°",
        saberDesc: "For the purely academic, we are very pleased with the excellent results of the Pruebas Saber of both 3rd and 5th grades. We have increased the level of the students to the Superior level in these tests.",
        communicationTitle: "Successful Communication",
        communicationDesc: "Communication between professors and parents has been very beneficial for the children. Whether that method is the Phideas Platform, Learning Center, homework from classes guided by professors, the receptivity of parents and the request for an external intervention, therapies, tutors, and advice given by School Orientation and the Academic Coordinator, we have increased successful communication."
      },
      highSchool: {
        title: "High School",
        desc1: "In High School, there have been many new implementations, actions, and strategies from the different areas with the purpose to reach the integral formation of the students and future performance in a society that each day demands more commitment, competiveness, and requirements in all aspects. This has contributed to students that are more conscious with appropriate discipline and good academic formation as a fundamental avenue to reach their established goals inside the academic process of the institution. Students who complete and achieve their established commitments.",
        desc2: "Likewise, this team has worked with much enthusiasm to create a sense of belonging to the school, developing an academic environment that is largely different in comparison with years before.",
        orientationTitle: "School & Professional Guidance",
        orientationDesc: "The office of School Orientation from the High School section contributes to this work. This office personally attends to disciplinary, academic, and emotional problems, as well as the value Project and other various activities done by the homerooms. For 10th and 11th graders, this office is at the front of the Professional Orientation activities to give the students a chance to self-reflect on their futures and be better prepared for the careers of their choice.",
        saberTitle: "Saber 11 & Academic Preeminence",
        saberDesc: "The high school team has continued to work in improving the Saber 11 exams. We have continued to implement intensive hours and simulation tests for grade 11 in order to continue being one of the top level schools in the country. These extra classes and practices take place during the regular school day, as well as alternate Saturdays.",
        activitiesTitle: "Pioneering Co-Curricular Programs",
        activitiesIntro: "High school unconditionally supports the completion of activities given by distinct areas in which we can re-enforce learning in a different way. For example:",
        activities: [
          {
            name: "Model United Nations (MUN)",
            detail: "Students from high school display a high academic level of debate, discipline, commitment, and self-control during the committees. Students also spend a lot of time preparing for the academic aspect with the use of every necessary cognitive ability."
          },
          {
            name: "Democratic Leadership",
            detail: "The elections of School Spoke Person, Student Council and Class Representative that contribute to the formation of values and civic responsibility by way of popular vote."
          },
          {
            name: "Woman Bilinguista Assembly",
            detail: "The assembly of the Woman Bilinguista on the International Day of Woman in which all of high school is involved."
          },
          {
            name: "Castellano Literary Mural",
            detail: "The implementation of an ever-changing mural where student have the opportunity to get to know all the literary works they have previously done in Castellano."
          },
          {
            name: "Recreation & Athletics",
            detail: "Football competitions between small teams each school day with the objective that the students use all their energy, and have a healthy and productive recreational time."
          },
          {
            name: "Convivencias (Spiritual Retreats)",
            detail: "Convivencias which contribute to the academic process. This activity’s objective is to enhance the moral and spiritual formation of the students, helping to mold them so that they will be examples in our society."
          },
          {
            name: "The Math Rally",
            detail: "Which involves the students using math from all levels of difficulty to create projects and enjoy others’ projects."
          },
          {
            name: "Francofonía (French Language)",
            detail: "A space where students demonstrate an advanced level of their third language of French."
          },
          {
            name: "International Summer Camps",
            detail: "In which the students live in the English language by attending classes with a high level of work and language enrichment and sharing it with students from various nationalities."
          }
        ]
      }
    },
    symbols: {
      title: "Symbols of the Institution",
      subtitle: "The heraldry, colors, and anthem embodying the soul of Colegio Bilingüe.",
      logoTitle: "The Shield & Coat of Arms",
      logoDesc: "The logo of the school has the following symbols that come together to construct the four elements of academic labor in the Fundación Colegio Bilingüe de Valledupar:",
      book: "The Book: Studying and investigation.",
      quill: "The Quill: Responsible work.",
      lamp: "The Lamp: Knowledge and light that lights the way.",
      mortarboard: "The Mortarboard (Birrete): Prize of the force and consecration of the Bilinguista student.",
      flagTitle: "The Flag",
      flagDesc: "The colors of the flag are red, white, and blue to identify Valledupar, England, and the United States, which represents the two official languages of the institution: English and Spanish.",
      anthemTitle: "School Anthem",
      anthemLyrics: [
        "Beauty springs and now we sing,",
        "orur bilingüe’s an aurora,",
        "that offers to us the gift,",
        "knowledge bring to give us honor.",
        "",
        "In the Fountain of Bilingüe,",
        "eager students drink to learn,",
        "of the records of the past,",
        "help the ambitions mind to grow.",
        "",
        "With instructions one will learn,",
        "about the city and the state,",
        "let them stay within your memory,",
        "to be a guiding ligth.",
        "",
        "The Bilingüe will project,",
        "the path of all your life,",
        "go forward Bilinguista,",
        "until you’ve conquered your goals.",
        "",
        "Become a worthwhile person,",
        "Colombia hopes the best for you,",
        "that you defend your rights,",
        "And don’t allow yourself to fail."
      ]
    },
    admissions: {
      title: "Admissions Process",
      subtitle: "Join a prestigious community dedicated to academic rigor and human values.",
      disclaimer: "[PLACEHOLDER: admissions content pending formal verification with the school administration]",
      steps: [
        {
          num: "01",
          title: "Initial Inquiry",
          desc: "Complete our digital information request form or contact our admissions office directly to express interest."
        },
        {
          num: "02",
          title: "Campus Guided Tour",
          desc: "Schedule a personalized visit to experience our world-class 60-acre campus, parks, and learn about our bilingual curriculum."
        },
        {
          num: "03",
          title: "Student Evaluation",
          desc: "We conduct a comprehensive holistic evaluation assessing social maturity, language base, and cognitive development."
        },
        {
          num: "04",
          title: "Enrollment & Registry",
          desc: "Upon acceptance, submit documentation and complete the formal registration processes to secure your child's placement."
        }
      ],
      formTitle: "Begin the Admissions Journey",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      phone: "Phone Number",
      grade: "Grade Level",
      message: "Personal Message / Inquiry Details",
      submit: "Submit Application",
      successMsg: "Thank you! Your inquiry has been received. Our Admissions Officer will contact you within 24 hours.",
    },
    contact: {
      title: "Get in Touch",
      subtitle: "We welcome you to visit us and experience our warm and rigorous academic community.",
      formTitle: "Send a Message",
      name: "Your Name",
      email: "Your Email",
      phone: "Your Phone",
      message: "Your Message",
      submit: "Send Message",
      successMsg: "Message sent successfully. We will get back to you shortly.",
      locationTitle: "Our Campus Location",
      address: "Calle 3 # 19B 105, Valledupar, Cesar, Colombia, Zip code 200005",
      phoneLabel: "Phone Number",
      emailLabel: "Email Address",
      followUs: "Follow Our Journey",
    },
    handbook: {
      title: "Student Handbook (Manual de Convivencia)",
      subtitle: "The ethical, civic, and academic guidelines shaping our campus life.",
      disclaimer: "This viewer provides a functional preview of our institutional handbook. The finalized PDF manual will be uploaded directly to the platform.",
      download: "Download official Handbook PDF"
    },
    calendar: {
      title: "Academic & Activities Calendar",
      subtitle: "Stay updated with our school calendar, scheduling, academic periods and institutional events.",
      loading: "Loading calendar activities...",
      noEvents: "No activities scheduled for this day.",
      viewAgenda: "Agenda view",
      selectedDayEvents: "Activities on",
      allMonthEvents: "All activities for this month",
      allDay: "All day",
      location: "Location",
      syncedWithGoogle: "Synchronized with Google Calendar",
      fallbackMock: "Showing scheduled academic activities",
      errorSync: "Unable to sync with Google Calendar. Displaying default activities.",
      configureAdmin: "Configure Google Calendar integration in the Administration Panel."
    },
    footer: {
      rights: "© 2026 Fundación Colegio Bilingüe de Valledupar. All rights reserved.",
      designed: "Crafted to World-Class Standards for Global Leaders.",
      quickLinks: "Quick Navigation",
    },
    virtualTour: {
      title: "Interactive Virtual Tour",
      subtitle: "Experience our premium 60-acre campus, cutting-edge academic laboratories, and world-class athletic spaces from anywhere.",
      panoramicView: "Simulated 360° Panorama",
      facilitiesCatalog: "Facilities Catalog",
      panInstruction: "Drag or scroll horizontally to explore the 360° campus layout. Click the pulsing hotspots to learn more.",
      panLeft: "Pan Left",
      panRight: "Pan Right",
      reset: "Reset View",
      all: "All Facilities",
      academic: "Labs & Classrooms",
      sports: "Athletic Fields",
      nature: "Green Parks & Gardens",
      social: "Social & Study Hubs",
      exploreBtn: "Explore Details",
      hotspots: {
        plaza: "Main Entrance & Plaza",
        plazaDesc: "Our grand architectural entrance welcoming students to a world of global opportunity and academic growth.",
        scienceLab: "Advanced Biology & Chemistry Lab",
        scienceLabDesc: "A university-level science laboratory equipped with modern safety hoods, glass equipment, and analytical scales.",
        sportsTrack: "Olympic-Grade Athletic Complex",
        sportsTrackDesc: "Professional synthetic running track and FIFA-regulation soccer fields designed to nurture athletic discipline.",
        library: "Bilingual Knowledge Center",
        libraryDesc: "An inspiring 12,000-book bilingual sanctuary featuring dedicated research zones, study carrels, and digital archives.",
        primaryPark: "Primary School Park & Gardens",
        primaryParkDesc: "Lush shaded playgrounds where students develop cooperative skills and connect with nature safely."
      },
      modal: {
        area: "Approximate Area",
        capacity: "Student Capacity",
        keyFeatures: "Key Highlights",
        close: "Close Tour"
      }
    }
  },
  ES: {
    nav: {
      home: "Inicio",
      aboutUs: "Nosotros",
      history: "Historia",
      missionVision: "Misión y Visión",
      quality: "Política y Obj. de Calidad",
      teacherProfile: "Perfil del Docente",
      studentProfile: "Perfil del Estudiante",
      theSchool: "El Colegio",
      preschool: "Preescolar",
      primary: "Primaria",
      highSchool: "Bachillerato",
      symbols: "Símbolos Institucionales",
      handbook: "Manual de Convivencia",
      admissions: "Admisiones",
      contact: "Contacto",
      virtualTour: "Recorrido Virtual",
      schedule: "Agendar Visita",
      apply: "Postularse",
      calendar: "Calendario",
      gallery: "Galería",
      galleryTitle: "Galería de fotos",
      gallerySubtitle: "Momentos de aprendizaje, deporte y convivencia en el Colegio Bilingüe.",
      galleryNoImages: "No se encontraron imágenes en este álbum.",
      galleryLoading: "Cargando galería...",
      galleryClose: "Cerrar",
      galleryAlbums: "Álbumes",
    },
    hero: {
      title: "Calidad Humana y Compromiso Social",
      subtitle: "Fundación Colegio Bilingüe de Valledupar",
      tagline: "Formando líderes globales bilingües con sólidos principios éticos desde 1980.",
      ctaPrimary: "Admisiones 2026-2027",
      ctaSecondary: "Explorar el Campus",
    },
    history: {
      title: "Nuestra Historia",
      subtitle: "Un legado de excelencia bilingüe y liderazgo comunitario en Valledupar.",
      foundingTitle: "El Génesis (1979 - 1980)",
      foundingText1: "En el año 1979 se estableció la fundación sin fines de lucro, firmándose el acta constitutiva en la Casa de la Cultura Cecilia Caballero de López el 7 de mayo de 1979. La personería jurídica fue obtenida y expedida por el Ministerio de Educación Nacional de Colombia mediante la Resolución N° 15283 del 6 de septiembre de 1979.",
      foundingText2: "En la década de 1970, durante la época del auge algodonero, esta región era visitada con frecuencia por el comerciante Gustavo Grauard, exportador de algodón a Inglaterra. En 1979, llegó a Valledupar acompañado por el rector y el vicerrector del colegio Parrish, el Sr. Shepherd y el Sr. Wagner. Trajeron consigo la idea de iniciar un colegio bilingüe en Valledupar.",
      foundingText3: "Al principio la idea no tuvo mucha acogida, pero a su regreso se encontraron con Alonso Sánchez Mejía, a quien le comunicaron la idea y él les manifestó que la única persona que prestaría atención sería el ingeniero Julio Villazón Baquero, quien posteriormente fue informado, y quien acogió y se dedicó a cristalizar esta idea; les suplicó que aplazaran su viaje de regreso a casa. Mientras tanto, hizo un anuncio en la emisora de radio Radio Guatapurí convocando a los padres de familia que pudieran estar interesados.",
      foundingFamilies: "La Primera Reunión y las Siete Familias Fundadoras",
      foundingFamiliesIntro: "A la primera reunión asistieron apenas catorce personas, en representación de las familias fundadoras del colegio. Las siete familias fundadoras estaban lideradas por:",
      families: [
        "Julio Villazón Baquero – Doris Castro de Villazón",
        "Alvaro Castro Socarrás – Leonor Palmera de Castro",
        "José Joaquín Sandoval – Dilia Pinto Araújo",
        "Edgardo Cuello Fernández – Beatriz Lacouture de Cuello",
        "Orlando Rois – Alida Gnecco de Rois",
        "Rubén Ortiz Martínez – Georgina de Ortiz",
        "Rodolfo Maestre Pavajeau – Letty Ariza de Maestre"
      ],
      expansionTitle: "Consolidando la Visión",
      expansionText1: "En la década de 1970, en la época del gran auge del algodón, el comerciante Gustavo Graubard frecuentaba la región para exportar algodón a Inglaterra. En 1979, llegó a Valledupar acompañado por el rector y el vicerrector, el Sr. Shepherd y el Sr. Wagner respectivamente, del Colegio Parrish. Trajeron consigo la idea de crear un colegio bilingüe en Valledupar. Al principio, no cuajó, pero al regresar, se encontraron con Alonso Sánchez Mejía. Le explicaron su idea y el señor Sánchez afirmó que la única persona que prestaría atención a esta idea era el ingeniero Julio Villazón Baquero. Fueron a buscarlo y de inmediato los recibió y se dispuso a realizar esta idea. Suplicó a los rectores que pospusieran su viaje de regreso mientras publicaba un anuncio en la emisora de radio local Radio Guatapurí buscando padres interesados en tal idea.",
      expansionText2: "Se reunió con el Sr. Shepherd y el Sr. Wagner durante los siguientes 10 días en una reunión que logró convocar a 50 personas y comenzó la inscripción en el colegio a un costo de $1000 por estudiante. Decidieron reunirse de nuevo. En la segunda reunión, intentaron inscribir a 118 padres de familia y aumentaron la cantidad a $20,000 por estudiante. El inicio de este proyecto se organizó primero bajo la dirección de Shepherd y Wagner, con el rector Victor More, quien contrató profesores colombianos y norteamericanos.",
      expansionText3: "El 28 de enero del año 1980 iniciaron oficialmente las labores de la Fundación Colegio Bilingüe de Valledupar. Como resultado de innumerables esfuerzos liderados por el señor Julio Villazón Baquero, quien finalmente logró la cohesión en torno a esta idea en la fundación de esta entidad sin ánimo de lucro, con el objetivo de ofrecer enseñanzas de alta calidad y de carácter bilingüe tanto en inglés como en español, en las cuales, simultáneamente y con rigor académico, se formaran ciudadanos de sólidos principios éticos, comprometidos con su contexto social.",
      academicYearTitle: "Los Primeros Pasos Académicos",
      academicText1: "En agosto de ese mismo año, bajo el calendario escolar B, el Colegio Bilingüe inició su primer año académico. Comenzando con 15 profesores y 138 estudiantes en preescolar, primaria y los dos primeros grados de bachillerato, y con Raymon Scheffer como Director General, quien ejerció como tal hasta 1981, siendo reemplazado por el Sr. David J. Barry (Q.E.P.D.). El Sr. Barry estuvo a cargo hasta junio de 1985, fecha en la que regresó a su país de origen. Durante los primeros tres años, el colegio funcionó provisionalmente en la Universidad Popular del Cesar (Parque Lineal Hurtado), y a partir del 1 de agosto de 1984 se trasladó a su ubicación actual en el sector norte de Valledupar, en un terreno de más de 60 acres, donde ha continuado desarrollándose en la estructura física que requiere una institución educativa tal como fue diseñada por sus fundadores.",
      academicText2: "El Director Barry fue reemplazado por el Director Académico Ricardo Spinel. Posteriormente, el colegio estuvo bajo la dirección general del Sr. Alastair Turton, quien más tarde entregó la subdirección a la Srta. Rocío Ospino de Saade. Desde 2009, la Sra. María Doris Villazón inició como Subdirectora y desde 2011 se convirtió en Directora General y Administrativa. La Rectora Académica es la psicóloga Cecilia Restrepo R., desde 2012.",
      academicText3: "El colegio cuenta con más de 70 reconocidos profesionales de la educación para atender a un total de 750 estudiantes en los niveles de preescolar, primaria y bachillerato. Está legalmente autorizado por el Ministerio de Educación Nacional mediante la Resolución N° 000928 del 3 de abril de 2013 de la Secretaría de Educación Municipal para ofrecer enseñanza formal en los niveles mencionados y en la modalidad académica de bilingüismo (inglés y español). El título de bachiller se expide en modalidad académica en los términos de la Resolución N° 00059 del 8 de abril de 2010.",
      academicText4: "Como organización sin ánimo de lucro, el colegio es dirigido por una Junta Directiva que establece las directrices y políticas generales de la Fundación, supervisando la ejecución y el cumplimiento de los principios bajo su propia filosofía. Ha sido presidida desde su fundación por el Honorable Julio Villazón Baquero. La Fundación Colegio Bilingüe de Valledupar, en sus años de labor, se ha consolidado como un paradigma de orientación local para la formación de ciudadanos que han debido asumir el liderazgo requerido por nuestro país."
    },
    missionVision: {
      title: "Filosofía y Liderazgo",
      subtitle: "Nuestros pilares institucionales guiando el futuro de los estudiantes.",
      mission: {
        title: "Misión",
        text: "La Fundación Colegio Bilingüe de Valledupar está comprometida con brindar una excelente educación bilingüe, la cual sigue un proceso integral de enseñanza-aprendizaje cuyo objetivo es preparar ciudadanos basados en valores fundamentales como el respeto, la honestidad y el servicio a la comunidad; líderes que sigan principios éticos y demuestren solidaridad. Aprendices de por vida que beneficiarán a la humanidad en este mundo desafiante, multicultural y tecnológicamente avanzado."
      },
      vision: {
        title: "Visión",
        text: "Para el año 2030, la Fundación Colegio Bilingüe de Valledupar continuará siendo reconocida como un colegio de excelencia que ofrece educación bilingüe, siguiendo una perspectiva globalizada basada en tendencias educativas y tecnológicas de vanguardia. El objetivo del colegio es desarrollar líderes éticos que promuevan la solidaridad y beneficien a la humanidad. Asimismo, ser una institución acreditada por Cognia y certificada por la norma ISO 9001:2015."
      }
    },
    quality: {
      title: "Política y Objetivos de Calidad",
      subtitle: "Nuestro compromiso absoluto con el rigor educativo y la mejora continua.",
      policyTitle: "Política de Calidad",
      policyText1: "La Fundación Colegio Bilingüe de Valledupar por más de 35 años ha estado formando personas con la capacidad de actuar por convicción personal, pensar críticamente y asumir responsabilidades que requieren la aplicación de valores como la ética y el respeto por las normas. Asimismo, los estudiantes y egresados de la institución, gracias a su excelente formación académica y en valores, son capaces de responder a los retos que trae la vida y formular soluciones.",
      policyText2: "Por esta razón, la Fundación Colegio Bilingüe de Valledupar se enorgullece de ver a sus exalumnos alcanzar cada uno de sus logros, como Alejandra Araujo Gutiérrez, estudiante graduada en 2014-2015, quien obtuvo el puesto 17 a nivel nacional en las pruebas de Estado con un puntaje promedio de 422 puntos. Nuestro estudiante, José Luis Martínez Cadavid, también merece un aplauso por obtener la Beca Orgullo Caribe de la Universidad del Norte en el programa de Ingeniería de Sistemas, la cual es la beca más importante de la costa Atlántica.",
      objectivesTitle: "Objetivos de Calidad",
      objectives: [
        "Garantizar una excelencia académica bilingüe que nos permita mantener altos niveles de competencia en pruebas internas y externas.",
        "Asegurar una colaboración eficaz entre el colegio, el estudiante, los padres de familia y la comunidad donde predominen los valores de respeto, honestidad y servicio.",
        "Desarrollar talentos en diferentes disciplinas deportivas y artísticas incrementando el nivel de competitividad de los estudiantes.",
        "Mantener el posicionamiento y la estabilidad financiera proyectada.",
        "Proveer y mantener la infraestructura necesaria para lograr la conformidad con los requisitos del servicio.",
        "Mantener el clima organizacional y las competencias del personal dentro de un enfoque de mejora continua."
      ]
    },
    profiles: {
      title: "Perfiles del Bilingüista",
      subtitle: "Las virtudes y características distintivas que definen a nuestra comunidad educativa.",
      teacher: {
        title: "Perfil del Docente Bilingüista",
        intro: "Entre los principios, Política y Objetivos de Calidad de la Fundación Colegio Bilingüe de Valledupar, se propone que el docente bilingüista sea un educador e investigador innovador, un agente de cambio, que sienta pasión por la enseñanza y que, mediante el desarrollo de sus talentos, desee formar nuevos líderes en la región y el país.",
        points: [
          "Debe poseer estándares decentes, destacándose por sus buenos modales y excelente presentación personal. Respetuoso, honesto, con sentido de servicio y de pertenencia a la institución.",
          "Es una persona íntegra. Empático, responsable, puntual, comprometido, tolerante, comprensivo y solidario; ético, espiritual y de principios humanistas.",
          "Debe ser un líder perseverante en sus metas, orientado al logro, comunicador eficaz con capacidad para debatir y resolver problemas.",
          "Pensador analítico, crítico y creativo; facilitador de aprendizajes significativos, individuales y cooperativos. Preocupado por su desarrollo personal y profesional.",
          "Productor de calidad, orientado a la capacidad de trabajo en equipo, aprendiz de y para toda la vida.",
          "Hace de cada día algo nuevo y positivo para su beneficio, el de su equipo, su colegio y la sociedad.",
          "Vive feliz por la grandeza de sus sueños, su respeto por la vida, por la verdad que profesa, los valores que conquista y el destino que forja."
        ]
      },
      student: {
        title: "Perfil del Estudiante Bilingüista",
        intro: "Entre los principios, Política y Objetivos de Calidad de la Fundación Colegio Bilingüe de Valledupar, el estudiante bilingüista será el protagonista de su aprendizaje, con iniciativa, sentido común, pensamiento analítico, crítico y creativo; la interiorización de valores como el respeto, la honestidad y el servicio a la comunidad les permite ser ciudadanos responsables, comprometidos y solidarios; guiados por la capacidad de debatir y resolver problemas. Esa autodirección, esfuerzo, perseverancia, motivación y trabajo en equipo les capacita para formarse como líderes capaces de lograr el bienestar y la excelencia en sus vidas mediante el desarrollo de sus talentos dentro de una sociedad multicultural, pluralista y tecnológicamente avanzada.",
        points: [
          "Debe tener buenos modales. Deben ser conocidos por sus buenos modales, excelente presentación personal y actitud positiva.",
          "Lleva con orgullo su uniforme como símbolo de pertenencia a la institución.",
          "Es el mejor hijo y el mejor amigo hoy, para ser el mejor padre y un mejor ciudadano mañana.",
          "Tiene integridad, empatía, respeta las diferencias, tolerancia y es comprensivo.",
          "Comienza cada día de forma nueva y positiva para el beneficio propio, de su familia, del colegio y de la sociedad.",
          "Nunca utiliza la fuerza, cuyas armas serán siempre la razón, el sentido común, la honestidad y el diálogo para encontrar soluciones a los problemas.",
          "Vive feliz bajo la grandeza de sus sueños, el respeto que siente por la vida, por la verdad que habla, por los valores que lleva consigo y por el destino que forja.",
          "Hace del estudio de sus asignaturas, de la libertad y de la justicia su único deseo.",
          "Está preparado para trabajar por un país al que ama, Colombia, y luchar por su libertad social, cultural y económica.",
          "Trabaja en equipo y con entusiasmo en actividades cívicas, sociales y culturales porque es un joven virtuoso que comprende las necesidades de los demás."
        ]
      }
    },
    school: {
      title: "Niveles Académicos y Vida Escolar",
      subtitle: "Una experiencia educativa integral desde la infancia hasta la preparación universitaria.",
      preschool: {
        title: "Preescolar",
        desc: "Al formar a nuestros estudiantes de preescolar, entendemos que las diferentes áreas del desarrollo funcionan de manera conjunta e integral, a nivel social, cognitivo y mediante el uso de habilidades motoras básicas para formar niños y estudiantes exitosos. Sabemos que el mejor camino hacia el conocimiento es a través de actividades que ayuden al desarrollo del pensamiento creativo y a comprender su entorno con aire fresco en el parque escolar. Concluimos el día con programas académicos complementarios en español, matemáticas, inglés y ciencias.",
        valuesTitle: "Programa de Valores",
        valuesDesc: "Con el fin de formar comportamientos guiados por valores y virtudes, el propósito de este programa es crear una asociación afectiva. Detrás de cada historia, canción, danza, dibujo y análisis, el estudiante aprende, explora y desarrolla habilidades que le ayudarán en su integración social de manera eficaz y a enfrentar sus propias emociones.",
        centerTitle: "Centro de Aprendizaje (Learning Center)",
        centerDesc: "Este es un sistema de apoyo extraescolar para brindar ayuda a los niños que requieren refuerzo de contenidos, ya sea en inglés, español, en lectura o escritura, o matemáticas. Se imparte en diferentes momentos del año, de acuerdo con las necesidades previamente observadas.",
        readingTitle: "Plan Lector: Cuéntame una historia",
        readingDesc: "Diseñado para reforzar las habilidades de lectura y escritura en inglés y español. Es una oportunidad para ingresar a un mundo lleno de imaginación que enriquece al máximo el vocabulario de los niños de preescolar. La intención de este proceso es fundamentalmente social, manifestar necesidades y ampliar el núcleo social, el cual posteriormente avanza hacia la adquisición de la escritura en Kínder y Transición.",
        activitiesTitle: "Enriquecimiento y Tradiciones",
        activitiesDesc: "Los niños de preescolar tienen la oportunidad de desarrollar habilidades no solo en los espacios habituales de la jornada escolar, como el deporte y el arte, sino también de participar en natación, campamento de fútbol, tenis extraescolar y el Festival Folclórico en abril, lo cual enriquece la vida en preescolar. También disfrutan del Día del Niño, Amor y Amistad, la Novena, el Show de Navidad, el Día del Idioma, Semana Santa, el Día de la Familia, Competencias Intercasas, asambleas, el diseño académico y las normas sociales.",
        teamTitle: "Nuestro Equipo Comprometido",
        teamDesc: "Para el desarrollo de todo lo anterior, contamos con un excelente equipo integrado por un coordinador, representante del colegio (padres de familia y exalumnos), dos docentes en el aula; en preescolar se cuenta con una auxiliar adicional, instructor de deportes y natación, y docente de artes, quienes siempre estarán acompañados por el docente principal. También contamos con enfermera escolar y salvavidas.",
        comfortsTitle: "Como en Casa",
        comfortsDesc: "El día del estudiante cuenta con todas las comodidades del hogar para facilitar esta transición a los más pequeños."
      },
      primary: {
        title: "Primaria",
        desc1: "Los valores que contribuyen positivamente al enriquecimiento personal y nos permiten encontrar razones para nuestras acciones consisten en tomar decisiones y resolver problemas. Esto debe hacerse desde una edad muy temprana. Este ha sido el objetivo primordial del equipo de primaria: mejorar el rendimiento académico de los niños y niñas; somos conscientes de que las relaciones sanas entre niños disciplinados propician un mejor ambiente académico.",
        desc2: "Por ello, durante este año continuaremos reforzando el Programa de Valores, desarrollando actividades como el Personaje de la Semana, realizando asambleas de valores y celebrando fechas especiales, asignando a cada grado un animal que represente un valor, y jugando juegos tradicionales durante el recreo, entendiendo que los juegos ayudan a establecer relaciones interpersonales. Sabemos que los niños y niñas de primaria son muy felices disfrutando en su nuevo parque.",
        mottoTitle: "Nuestro Lema en Acción",
        mottoDesc: "Trabajando coherentemente con el Programa de Valores, y con nuestro hermoso lema 'Calidad Humana y Compromiso Social', continuamos con el programa social denominado 'Mi Vida, Mi Mundo', patrocinando diferentes fundaciones dedicadas a mejorar la calidad de vida de muchos niños desamparados y necesitados de la ciudad.",
        teamworkTitle: "Trabajo en Equipo y Compasión",
        teamworkDesc: "Trabajando en equipo, por grados, nuestros niños son participantes activos en diferentes actividades lúdicas, culturales y educativas con la recolección de ropa, juguetes, libros, alimentos, etc., de una manera que refleja la ayuda mutua, donde formamos a nuestros niños para que sean seres humanos unidos, comprometidos con una vida digna y un mundo mejor.",
        ecologyTitle: "Proyecto Ecológico",
        ecologyDesc: "Otros programas ejecutados en nuestra sección incluyen el exitoso 'Proyecto de Ecología', donde los niños reciben constantemente charlas educativas sobre el cuidado de nuestros recursos naturales, dando especial importancia al reciclaje de botellas plásticas desechables utilizadas en todo el colegio. Estas botellas se utilizan posteriormente para decoración, disfraces, carteras, regalos de Navidad, juguetes, entre otras cosas. Como cierre del proyecto y recompensa, los estudiantes de primaria son llevados a la Escuela Ambiental de Valledupar para explorar el espacio e interactuar con el medio ambiente.",
        homeTitle: "Vínculos Familiares y Excelencia",
        homeDesc: "Como resultado del Programa de Valores, se observó que uno de los factores que más influye en el rendimiento académico de los niños es el ambiente en el hogar. Por esta razón, continuaremos apoyando los lazos familiares apropiados orientados al Personaje de la Semana, donde los estudiantes irán a casa con su póster y valor correspondiente y trabajarán con sus familias. Más tarde, el estudiante compartirá su trabajo y todo lo que hizo con sus compañeros de clase.",
        saberTitle: "Pruebas Saber 3° y 5°",
        saberDesc: "En lo puramente académico, estamos muy complacidos con los excelentes resultados de las Pruebas Saber de los grados 3° y 5°. Hemos incrementado el nivel de los estudiantes al nivel Superior en estas pruebas de estado.",
        communicationTitle: "Comunicación de Éxito",
        communicationDesc: "La comunicación entre profesores y padres ha sido muy beneficiosa para los niños. Ya sea a través de la Plataforma Phideas, el Centro de Aprendizaje, tareas guiadas por profesores, la receptividad de los padres y la solicitud de intervención externa, terapias, tutorías y asesoría brindada por Orientación Escolar y la Coordinación Académica, hemos incrementado el éxito en la comunicación."
      },
      highSchool: {
        title: "Bachillerato",
        desc1: "En bachillerato se han implementado numerosas acciones, estrategias y novedades en las diferentes áreas con el propósito de lograr la formación integral de los estudiantes y su desempeño futuro en una sociedad que cada día exige más compromiso, competitividad y requerimientos en todos los aspectos. Esto ha contribuido a formar estudiantes más conscientes, con una disciplina adecuada y una buena formación académica como vía fundamental para alcanzar las metas establecidas dentro del proceso académico de la institución; estudiantes que cumplen y logran sus compromisos establecidos.",
        desc2: "Asimismo, este equipo ha trabajado con mucho entusiasmo para crear un sentido de pertenencia hacia el colegio, desarrollando un ambiente académico significativamente diferente en comparación con años anteriores.",
        orientationTitle: "Orientación Escolar y Profesional",
        orientationDesc: "La oficina de Orientación Escolar de la sección de Bachillerato contribuye a esta labor. Esta oficina atiende personalmente problemas disciplinarios, académicos y emocionales, así como el Proyecto de Valores y otras actividades realizadas por los directores de grupo. Para los grados 10° y 11°, esta oficina lidera las actividades de Orientación Profesional para brindar a los estudiantes la oportunidad de reflexionar sobre su futuro y prepararse mejor para las carreras de su elección.",
        saberTitle: "Saber 11 y Preeminencia Académica",
        saberDesc: "El equipo de bachillerato ha seguido trabajando en el mejoramiento de las pruebas Saber 11. Hemos continuado implementando horas intensivas y simulacros para el grado 11 con el fin de seguir estando entre los colegios con mejor nivel del país. Estas clases y prácticas adicionales se llevan a cabo durante la jornada escolar habitual, así como en sábados alternos.",
        activitiesTitle: "Programas Co-Curriculares Líderes",
        activitiesIntro: "Bachillerato apoya incondicionalmente la realización de actividades propuestas por las distintas áreas para reforzar el aprendizaje de una manera diferente. Por ejemplo:",
        activities: [
          {
            name: "Modelo de Naciones Unidas (MUN)",
            detail: "Los estudiantes de bachillerato demuestran un alto nivel académico de debate, disciplina, compromiso y autocontrol durante los comités. Los estudiantes también dedican mucho tiempo a prepararse para el aspecto académico con el uso de todas las habilidades cognitivas necesarias."
          },
          {
            name: "Liderazgo Democrático",
            detail: "Elecciones de Personero Escolar, Consejo Estudiantil y Representantes de Clase, que contribuyen a la formación de valores y de responsabilidad cívica mediante el voto popular."
          },
          {
            name: "Asamblea de la Mujer Bilingüista",
            detail: "Asamblea de la Mujer Bilingüista en el Día Internacional de la Mujer, en la cual participa toda la sección de bachillerato."
          },
          {
            name: "Mural Literario en Castellano",
            detail: "Implementación de un mural literario en constante cambio, donde los estudiantes tienen la oportunidad de conocer todas las obras literarias que han trabajado previamente en Castellano."
          },
          {
            name: "Recreación y Deportes",
            detail: "Competencias de fútbol entre pequeños equipos cada día escolar, con el objetivo de que los estudiantes utilicen su energía y tengan un tiempo de recreación saludable y productivo."
          },
          {
            name: "Convivencias Espirituales",
            detail: "Convivencias que contribuyen al proceso académico. El objetivo de esta actividad es potenciar la formación moral y espiritual de los estudiantes, ayudando a moldearlos para que sean ejemplos en nuestra sociedad."
          },
          {
            name: "El Rally de Matemáticas",
            detail: "En el cual los estudiantes utilizan las matemáticas en todos los niveles de dificultad para crear proyectos y disfrutar de los proyectos de los demás."
          },
          {
            name: "Francofonía (Idioma Francés)",
            detail: "Un espacio donde los estudiantes demuestran un nivel avanzado de su tercer idioma, el francés."
          },
          {
            name: "Campamentos de Verano Internacionales",
            detail: "En los cuales los estudiantes conviven en el idioma inglés asistiendo a clases de alto rendimiento, enriquecimiento de la lengua y compartiendo con estudiantes de diversas nacionalidades."
          }
        ]
      }
    },
    symbols: {
      title: "Símbolos de la Institución",
      subtitle: "La heráldica, colores e himno que encarnan el alma del Colegio Bilingüe.",
      logoTitle: "El Escudo Institucional",
      logoDesc: "El escudo del colegio cuenta con los siguientes símbolos que se unen para construir los cuatro elementos de la labor académica en la Fundación Colegio Bilingüe de Valledupar:",
      book: "El Libro: Estudio e investigación.",
      quill: "La Pluma: Trabajo responsable.",
      lamp: "La Lámpara: Conocimiento y luz que ilumina el camino.",
      mortarboard: "El Birrete: Premio al esfuerzo y consagración del estudiante bilingüista.",
      flagTitle: "La Bandera",
      flagDesc: "Los colores de la bandera son rojo, blanco y azul para identificar a Valledupar, Inglaterra y los Estados Unidos, representando las dos lenguas oficiales de la institución: inglés y español.",
      anthemTitle: "Himno Escolar",
      anthemLyrics: [
        "Brota la belleza y ahora cantamos,",
        "nuestro bilingüe es una aurora,",
        "que nos ofrece el don,",
        "del conocimiento para darnos honor.",
        "",
        "En la fuente del bilingüismo,",
        "ansiosos estudiantes beben para aprender,",
        "de los registros del pasado,",
        "ayudando a crecer a la mente ambiciosa.",
        "",
        "Con enseñanzas uno aprenderá,",
        "sobre la ciudad y el estado,",
        "que permanezcan en tu memoria,",
        "para ser una luz de guía.",
        "",
        "El Bilingüe proyectará,",
        "el camino de toda tu vida,",
        "¡adelante Bilinguista!,",
        "hasta conquistar tus metas.",
        "",
        "Conviértete en alguien de valor,",
        "Colombia espera lo mejor de ti,",
        "para que defiendas tus derechos,",
        "y no te permitas desfallecer."
      ]
    },
    admissions: {
      title: "Proceso de Admisiones",
      subtitle: "Únase a una comunidad de prestigio dedicada al rigor académico y los valores humanos.",
      disclaimer: "[PLACEHOLDER: contenido de admisiones pendiente de confirmar con la administración del colegio]",
      steps: [
        {
          num: "01",
          title: "Consulta Inicial",
          desc: "Complete nuestro formulario digital de solicitud de información o póngase en contacto directamente con nuestra oficina de admisiones."
        },
        {
          num: "02",
          title: "Visita Guiada al Campus",
          desc: "Agende una visita personalizada para conocer nuestro campus de más de 60 acres, sus parques y conocer nuestro plan de estudios bilingüe."
        },
        {
          num: "03",
          title: "Evaluación del Aspirante",
          desc: "Realizamos una evaluación integral y holística para valorar el desarrollo cognitivo, la madurez social y la base del idioma."
        },
        {
          num: "04",
          title: "Matrícula y Registro",
          desc: "Una vez admitido, presente la documentación requerida y complete los procesos de inscripción para asegurar el cupo de su hijo."
        }
      ],
      formTitle: "Comience el Proceso de Admisión",
      firstName: "Primer Nombre",
      lastName: "Apellidos",
      email: "Correo Electrónico",
      phone: "Número de Teléfono",
      grade: "Grado de Interés",
      message: "Mensaje Personal / Detalles de Consulta",
      submit: "Enviar Solicitud",
      successMsg: "¡Gracias! Su consulta ha sido recibida. Nuestro oficial de admisiones se comunicará con usted en menos de 24 horas.",
    },
    contact: {
      title: "Póngase en Contacto",
      subtitle: "Le damos la bienvenida a visitarnos y experimentar nuestra cálida y rigurosa comunidad académica.",
      formTitle: "Enviar Mensaje",
      name: "Su Nombre",
      email: "Su Correo",
      phone: "Su Teléfono",
      message: "Su Mensaje",
      submit: "Enviar Mensaje",
      successMsg: "Mensaje enviado exitosamente. Nos pondremos en contacto muy pronto.",
      locationTitle: "Ubicación de Nuestro Campus",
      address: "Calle 3 # 19B 105, Valledupar, Cesar, Colombia, Código Postal 200005",
      phoneLabel: "Número Telefónico",
      emailLabel: "Correo Electrónico",
      followUs: "Siga Nuestro Camino",
    },
    handbook: {
      title: "Manual de Convivencia (Student Handbook)",
      subtitle: "Las directrices éticas, cívicas y académicas que rigen la vida en nuestro campus.",
      disclaimer: "Este visor proporciona un adelanto funcional de nuestro manual de convivencia institucional. El documento PDF definitivo se cargará directamente en la plataforma.",
      download: "Descargar PDF oficial del Manual de Convivencia"
    },
    calendar: {
      title: "Calendario de Actividades",
      subtitle: "Manténgase informado sobre las actividades académicas, periodos bimensuales, asambleas y eventos del colegio.",
      loading: "Cargando actividades del calendario...",
      noEvents: "No hay actividades programadas para este día.",
      viewAgenda: "Vista agenda",
      selectedDayEvents: "Actividades el",
      allMonthEvents: "Todas las actividades del mes",
      allDay: "Todo el día",
      location: "Ubicación",
      syncedWithGoogle: "Sincronizado con Google Calendar",
      fallbackMock: "Mostrando programación de actividades académicas",
      errorSync: "No se pudo sincronizar con Google Calendar. Mostrando actividades predeterminadas.",
      configureAdmin: "Configure la integración con Google Calendar en el Panel de Administración."
    },
    footer: {
      rights: "© 2026 Fundación Colegio Bilingüe de Valledupar. Todos los derechos reservados.",
      designed: "Diseñado bajo los más altos estándares mundiales para líderes globales.",
      quickLinks: "Navegación Rápida",
    },
    virtualTour: {
      title: "Recorrido Virtual Interactivo",
      subtitle: "Explore nuestro campus premium de más de 60 acres, laboratorios académicos de última generación y áreas deportivas de nivel mundial.",
      panoramicView: "Panorama 360° Simulado",
      facilitiesCatalog: "Catálogo de Instalaciones",
      panInstruction: "Arrastre o desplace horizontalmente para explorar el campus en 360°. Toque los puntos interactivos para conocer más.",
      panLeft: "Girar Izquierda",
      panRight: "Girar Derecha",
      reset: "Restaurar Vista",
      all: "Todas las Áreas",
      academic: "Laboratorios y Aulas",
      sports: "Complejo Deportivo",
      nature: "Parques y Zonas Verdes",
      social: "Biblioteca y Áreas Comunes",
      exploreBtn: "Ver Detalles",
      hotspots: {
        plaza: "Plaza Principal y Acceso",
        plazaDesc: "Nuestra gran entrada arquitectónica que da la bienvenida a un entorno de bilingüismo y crecimiento académico.",
        scienceLab: "Laboratorio de Ciencias Avanzadas",
        scienceLabDesc: "Laboratorio científico de nivel universitario, equipado con campanas de extracción, microscopios y balanzas de alta precisión.",
        sportsTrack: "Complejo Deportivo y Pista de Atletismo",
        sportsTrackDesc: "Pista de atletismo profesional y canchas reglamentarias de fútbol diseñadas para fomentar la disciplina física y el trabajo en equipo.",
        library: "Biblioteca Bilingüe y Centro de Consulta",
        libraryDesc: "Santuario del saber con más de 12,000 ejemplares en inglés y español, zonas de estudio independiente y recursos digitales.",
        primaryPark: "Parque Infantil de Primaria",
        primaryParkDesc: "Exuberantes zonas de juego con sombra natural donde los estudiantes desarrollan habilidades sociales y se conectan con la naturaleza."
      },
      modal: {
        area: "Área Aproximada",
        capacity: "Capacidad de Alumnos",
        keyFeatures: "Aspectos Destacados",
        close: "Cerrar Recorrido"
      }
    }
  }
};
