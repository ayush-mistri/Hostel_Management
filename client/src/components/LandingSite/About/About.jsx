import { TeamCard } from "./TeamMember";

function About() {
  const Ayush = {
    name: "Ayush Mistri",
    designation: "MERN-stack Developer",
    image:
      "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png",
  };
  const Krish = {
    name: "Mavani Krish",
    designation: "Backend Developer",
    image:
      "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png",
  };

  return (
    <section className="text-white text-center px-4 py-10 md:py-16 lg:py-20">
      <h1 className="font-bold text-4xl md:text-5xl">Meet Our Team!</h1>

      {/* Team Member Cards */}
      <div className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-10">
        <TeamCard member={Ayush} />
        <TeamCard member={Krish} />
      </div>
    </section>
  );
}

export { About };
