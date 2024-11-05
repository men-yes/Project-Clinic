import React from 'react';
import '../CSScomponents/Home.css';
import Navbar from './Navbar';
// import { motion } from "framer-motion";
import Contact from './Contact';
import Articles from './Articles';
import Footer from './Footer';
import Header from './Header';

const Home = () => {
   return (
      <div className="home-container">
        <Header />
        <Navbar />
        <Articles />
        <Contact />
        <Footer />
      </div>
   );
}

export default Home;
