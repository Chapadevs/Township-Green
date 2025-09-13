const About = () => {
  return (
    <section className="py-20 px-10" id="about">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-white text-4xl font-bold leading-tight tracking-tight">
          About Township Community
        </h2>
        <p className="text-gray-300 text-lg leading-relaxed mt-6">
          Township Community is more than just a space; it's a vibrant hub for creativity and relaxation. 
          We provide a safe and welcoming environment for stoners to come together, share their passion for art, 
          and enjoy the company of fellow enthusiasts. Our events are designed to foster a sense of community, 
          encourage artistic expression, and provide a unique experience that blends the joy of drawing with the 
          calming effects of cannabis.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-[#1d2d25] p-6 rounded-lg shadow-2xl">
            <div className="text-[var(--primary-color)] mb-4">
              <span className="material-symbols-outlined text-4xl">palette</span>
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Creative Sessions</h3>
            <p className="text-gray-400">
              Join guided art sessions where creativity flows freely in a relaxed, cannabis-friendly environment.
            </p>
          </div>
          
          <div className="bg-[#1d2d25] p-6 rounded-lg shadow-2xl">
            <div className="text-[var(--primary-color)] mb-4">
              <span className="material-symbols-outlined text-4xl">groups</span>
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Community Focus</h3>
            <p className="text-gray-400">
              Connect with like-minded individuals in a safe, welcoming space designed for artistic collaboration.
            </p>
          </div>
          
          <div className="bg-[#1d2d25] p-6 rounded-lg shadow-2xl">
            <div className="text-[var(--primary-color)] mb-4">
              <span className="material-symbols-outlined text-4xl">local_florist</span>
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Safe Environment</h3>
            <p className="text-gray-400">
              Experience a professional, legal consumption lounge that prioritizes safety and comfort above all.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;