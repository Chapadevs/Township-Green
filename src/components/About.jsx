const About = () => {
  return (
    <section className="pt-4 pb-4 md:pt-8 md:pb-8 px-10" id="about">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative mb-4">
          <h2 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-tight font-['Space_Grotesk'] relative z-10">
            What 
            <span className="inline-block mx-2">we</span>
            <span className="inline-block ml-1">do?</span>
          </h2>
        </div>
        <p className="text-gray-300 text-lg leading-relaxed mt-6">
        Entertainment rental space ideal for your private event.
        Host your art, yoga, music, bachelorette, business, sports, or whatever event here at Top of the Green!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-[#1d2d25] p-6 rounded-lg shadow-2xl">
            <div className="text-[var(--primary-color)] mb-4">
              <span className="material-symbols-outlined text-4xl">palette</span>
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Creative Sessions</h3>
            <p className="text-gray-400">
            Top of the Green regularly hosts art sessions for people to express their inner artist.  These can be 420 friendly experiences if you so choose, regardless all are welcome.            </p>
          </div>
          
          <div className="bg-[#1d2d25] p-6 rounded-lg shadow-2xl">
            <div className="text-[var(--primary-color)] mb-4">
              <span className="material-symbols-outlined text-4xl">groups</span>
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Community Focus</h3>
            <p className="text-gray-400">
            We are proud members of our local and surrounding communities. Musicians, tattoo artists, comedians, yoga instructors, candle makers, and just about any other event or experience, we can accommodate your needs.
            </p>
          </div>
          
          <div className="bg-[#1d2d25] p-6 rounded-lg shadow-2xl">
            <div className="text-[var(--primary-color)] mb-4">
              <span className="material-symbols-outlined text-4xl">local_florist</span>
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Safe Environment</h3>
            <p className="text-gray-400">
            We offer clean and professional space for you and your guests. We will work with you to make your event a success
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;