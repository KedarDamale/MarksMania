import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Menu,
  X,
  CheckCircle2,
  MessageSquare,
  Fingerprint,
  ShieldHalf,
  BatteryCharging,
  PlugZap,
  GlobeLock,
} from "lucide-react";
import Logo123 from "../assets/Logo123.png";
import codeImg from "../assets/code.jpg";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import user1 from "../assets/profile-pictures/user1.jpg";
import user2 from "../assets/profile-pictures/user2.jpg";
import user3 from "../assets/profile-pictures/user3.jpg";

import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";

// Constants
const navItems = [
  { label: "Features", href: "#FeatureSection" },
  { label: "Workflow", href: "#WorkflowSection" },
  { label: "Testimonials", href: "#TestimonialsSection" },
];

const features = [
  {
    icon: <MessageSquare />,
    text: "Comprehensive Dashboard",
    description:
      "A powerful dashboard designed for teachers to manage and analyze student marks efficiently.",
  },
  {
    icon: <Fingerprint />,
    text: "Student Management",
    description:
      "Easily manage student records, including registration, batch allocation, and academic details.",
  },
  {
    icon: <ShieldHalf />,
    text: "Marks Management",
    description:
      "Streamlined marks entry system with validation and instant calculation features.",
  },
  {
    icon: <BatteryCharging />,
    text: "Data Export",
    description:
      "Export marks data to CSV format for further analysis or record-keeping.",
  },
  {
    icon: <PlugZap />,
    text: "Statistical Analysis",
    description:
      "Detailed statistical analysis with visual charts for better performance insights.",
  },
  {
    icon: <GlobeLock />,
    text: "Subject Management",
    description:
      "Comprehensive subject management system for different branches and semesters.",
  },
];

const checklistItems = [
  {
    title: "Easy Marks Entry",
    description:
      "Intuitive interface for quick and accurate marks entry with validation.",
  },
  {
    title: "Data Analytics",
    description:
      "Visual representation of student performance across subjects and batches.",
  },
  {
    title: "Export Functionality",
    description:
      "Export data to CSV format for external analysis and record-keeping.",
  },
  {
    title: "Subject Management",
    description:
      "Efficient management of subjects across different branches and semesters.",
  },
];

const testimonials = [
  {
    user: "Prof. M. S. Joshi",
    company: "Department of Computer Science",
    image: user1,
    text: "MarksMania has revolutionized how I manage student marks. The analytics dashboard provides valuable insights, and the export feature saves hours of work.",
  },
  {
    user: "Dr. Y. G. Gajmal",
    company: "Department of Information Technology",
    image: user2,
    text: "The interface is incredibly user-friendly. I can manage multiple subjects and batches effortlessly. The statistical analysis helps identify trends in student performance.",
  },
  {
    user: "Prof. A. Palwankar",
    company: "Department of Electronics",
    image: user3,
    text: "MarksMania's subject management and marks entry system is a game-changer. The validation features ensure accuracy, and the export functionality is perfect for documentation.",
  },
];

const LandingPage = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <div className="font-kanit bg-custom-dark">
      <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80  ">
        <div className="container px-4 mx-auto relative lg:text-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center flex-shrink-0">
              <img className="h-14 mr-2" src={Logo123} alt="Logo" />
              <span className="text-3xl tracking-tight text-text-colour">
                MarksMania
              </span>
            </div>
            <ul className="hidden lg:flex ml-14 space-x-12 text-text-colour">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a href={item.href} className="relative group">
                    {item.label}
                    <span className="absolute left-0 bottom-0 w-full h-1 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="hidden lg:flex justify-center space-x-12 items-center text-text-colour">
              <a
                href="/login"
                className="py-2 px-3 border rounded-md relative group text-white-700 transition-colors duration-300 hover:text-white hover:bg-black"
              >
                Sign In
                <span className="absolute left-0 bottom-0 w-full h-1 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>

              <a
                href="/signup"
                className="bg-gradient-to-r from-emerald-500 to-emerald-900 py-2 px-3 rounded-md relative group hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
              >
                Create an account
                <span className="absolute left-0 bottom-0 w-full h-1 bg-emerald-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
            </div>
            <div className="lg:hidden md:flex flex-col justify-end text-text-colour">
              <button onClick={toggleNavbar} className="relative group">
                {mobileDrawerOpen ? <X /> : <Menu />}
                <span className="absolute left-0 bottom-0 w-full h-1 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </button>
            </div>
          </div>
          {mobileDrawerOpen && (
            <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden text-text-colour">
              <ul>
                {navItems.map((item, index) => (
                  <li key={index} className="py-4 relative group">
                    <a href={item.href} className="relative">
                      {item.label}
                      <span className="absolute left-0 bottom-0 w-full h-1 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="flex space-x-6">
                <a
                  href="/login"
                  className="py-2 px-3 border rounded-md relative group text-white-700 transition-colors duration-300 hover:text-white hover:bg-black"
                >
                  Sign In
                  <span className="absolute left-0 bottom-0 w-full h-1 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </a>
                <a
                  href="/signup"
                  className="py-2 px-3 rounded-md bg-gradient-to-r from-emerald-500 to-emerald-900 relative group hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
                >
                  Create an account
                  <span className="absolute left-0 bottom-0 w-full h-1 bg-emerald-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="flex flex-col items-center mt-6 lg:mt-20 px-4 md:px-8 lg:px-16">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide text-text-colour">
          Marks Management
          <span className="bg-gradient-to-r from-emerald-500 to-emerald-900 text-transparent bg-clip-text">
            {" "}
            for Teachers
          </span>
        </h1>
        <p className="mt-12 text-lg text-center text-neutral-300 max-w-4xl">
          Streamline your academic marks management with our comprehensive solution.
          From marks entry to statistical analysis, MarksMania helps you manage student
          performance efficiently.
        </p>
        <div className="flex justify-center my-10">
          <a
            href="/dashboard"
            className="relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-gray-900 rounded-md overflow-hidden group"
          >
            <span className="relative z-10">Launch MarksMania</span>
            <div className="absolute inset-2 bg-gradient-to-r from-[#016e06] via-[#37ff59] to-[#016e06] opacity-50 blur-md transition-transform duration-50 group-hover:scale-110"></div>
          </a>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 mt-10">
          <video
            autoPlay
            loop
            muted
            className="rounded-lg w-full max-w-lg border border-emerald-700 shadow-sm shadow-emerald-400 mx-auto"
          >
            <source src={video1} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <video
            autoPlay
            loop
            muted
            className="rounded-lg w-full max-w-lg border border-emerald-700 shadow-sm shadow-emerald-400 mx-auto"
          >
            <source src={video2} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <div
        id="FeatureSection"
        className="relative mt-20 border-b border-neutral-800 px-4 md:px-6 lg:px-8 pb-0 text-text-colour"
      >
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mt-8 lg:mt-12 tracking-wide">
            Efficiently manage{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-900 text-transparent bg-clip-text">
              student marks
            </span>
          </h2>
        </div>
        <div className="flex flex-wrap mt-12 mb-0">
          {features.map((feature, index) => (
            <div key={index} className="w-full sm:w-1/2 lg:w-1/3 p-6">
              <div className="flex items-start">
                <div className="flex h-10 w-10 p-3 bg-neutral-900 text-emerald-700 justify-center items-center rounded-full">
                  {feature.icon}
                </div>
                <div className="ml-6">
                  <h5 className="text-lg mb-4">{feature.text}</h5>
                  <p className="text-md mb-6 text-neutral-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div id="WorkflowSection" className="mt-20 text-text-colour">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center mt-6 tracking-wide mb-8">
          Streamline your{" "}
          <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-transparent bg-clip-text">
            workflow
          </span>
        </h2>
        <div className="flex flex-wrap justify-center">
          <div className="px-4 md:px-6 lg:px-8 p-3 w-full lg:w-auto">
            <img
              src={codeImg}
              alt="Coding"
              className="w-full max-w-xs md:max-w-sm lg:max-w-md mx-auto"
            />
          </div>
          <div className="pt-4 w-full lg:w-1/2">
            {checklistItems.map((item, index) => (
              <div key={index} className="flex mb-12">
                <div className="text-green-400 mx-6 bg-neutral-900 h-12 w-12 p-2 justify-center items-center rounded-full">
                  <CheckCircle2 />
                </div>
                <div>
                  <h5 className="mt-1 mb-2 text-xl">{item.title}</h5>
                  <p className="text-md text-neutral-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        id="TestimonialsSection"
        className="mt-20 tracking-wide max-w-5xl mx-auto px-4 md:px-6 lg:px-8 text-text-colour"
      >
        <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center my-10 lg:my-20">
          What Teachers are saying
        </h2>
        <div className="flex flex-wrap justify-center">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-full sm:w-1/2 lg:w-1/3 px-4 py-2">
              <div className="bg-neutral-900 rounded-md p-6 text-md border border-neutral-800 font-thin">
                <p>{testimonial.text}</p>
                <div className="flex mt-8 items-start">
                  <img
                    className="w-12 h-12 mr-6 rounded-full border border-neutral-300"
                    src={testimonial.image}
                    alt=""
                  />
                  <div>
                    <h6>{testimonial.user}</h6>
                    <span className="text-sm font-normal italic text-neutral-600">
                      {testimonial.company}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-20 border-t py-10 border-neutral-700 max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <a
              href="https://twitter.com"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter
                className="text-neutral-300 hover:text-emerald-500"
                size={24}
              />
            </a>
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook
                className="text-neutral-300 hover:text-emerald-500"
                size={24}
              />
            </a>
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram
                className="text-neutral-300 hover:text-emerald-500"
                size={24}
              />
            </a>
            <a
              href="https://linkedin.com"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin
                className="text-neutral-300 hover:text-emerald-500"
                size={24}
              />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-neutral-300 text-center md:text-left">
            &copy; {new Date().getFullYear()} MarksMania. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
