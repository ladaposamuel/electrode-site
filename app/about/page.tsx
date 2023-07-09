export default function AboutPage() {

  const experienceYears = 5;
  const frameworks = ['PHP', 'Laravel', 'Lumen'];

  return (
    <section>
      <h1 className="font-bold text-3xl font-serif">About Me</h1>
      <p className="my-5 text-neutral-800 dark:text-neutral-200">
      {`I am a self-driven and meticulous Back-End Engineer with ${experienceYears} years of experience in software testing and debugging, as well as coding and design.`}
      </p>
      <p className=" text-neutral-800 dark:text-neutral-200">
      {`I am fluent in ${frameworks.join(', ')} frameworks.`}
      </p>
      <p className="my-5 text-neutral-800 dark:text-neutral-200">
      {`Additionally, I have a good understanding of data structures and algorithms, REST APIs, testing, security, and Agile methodology.${'\n'}
        As a collaborative team player with excellent interpersonal skills, I am a creative problem-solver and forward-thinking developer ready to help businesses make the most of their digital future.`}
      </p>
    

    </section>
  );
}
