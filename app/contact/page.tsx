import Image from 'next/image';

export default function Contact() {


    return (
        <section>
        <h1 className="font-bold text-3xl font-serif">Let's Connect! 📞🌟</h1>
        <p>&nbsp;</p>
        <Image
            alt={'Samuel Ladapo'}
            height={600}
            width={600}
            src={'https://i.imgur.com/DEXcwFy.png'}
            quality={100}
          />

        <p className="my-5 text-neutral-800 dark:text-neutral-200">
          {`Hey there! 👋 Whether you want to discuss a project, share ideas, or just have a tech chat, I'm all ears! Feel free to drop me a line at `}
          <a
            href="mailto:hello@electrode.dev"
            className="text-primary-500 hover:underline"
          >
           <b> hello@electrode.dev</b>
          </a>
          {`. Let's embark on a journey to turn your ideas into digital magic!`}
        </p>
        
        <p className="my-5 text-neutral-800 dark:text-neutral-200">
          {`Additionally, I'm not just your average developer. I bring a sprinkle of creativity and innovation to every project. With a solid grasp of data 
          structures 📊 and algorithms 🧮, a knack for building REST APIs 🌐, a dedication to robust testing ✅, and a passion for security 🔒, I'm your go-to tech enthusiast! Let's collaborate and craft digital wonders together! 💡`}
        </p>
      </section>
      
    );
  }
  