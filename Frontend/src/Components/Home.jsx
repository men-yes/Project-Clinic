import React from 'react';
import '../CSScomponents/Home.css';
import Navbar from './Navbar';
// import { motion } from "framer-motion";
import Contact from './Contact';
import Articles from './Articles';
import Footer from './Footer';
import Header from './Header';
import Specialization from './Specialization';
import Therapists from './Therapists';

const Home = () => {
   return (
      <div className="home-container" id='home'>
        <Header />
        <Navbar />
        
        <Specialization />
        <Therapists />
        <Articles />
        <Contact />
        <Footer />
      </div>
   );
}

export default Home;
