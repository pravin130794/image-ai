import { Collection } from "@/components/shared/Collection";
import { navLinks } from "@/constants";
import { getAllImages } from "@/lib/actions/image.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { SignedIn, auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Home = async ({ searchParams }: SearchParamProps) => {
  const { userId } = auth();
  const page = Number(searchParams?.page) || 1;
  const searchQuery = (searchParams?.query as string) || "";
  if (userId) {
    const user = await getUserById(userId);
    var images = await getAllImages({ page, searchQuery, userId: user._id });
  } else {
    var images = await getAllImages({ page, searchQuery });
  }

  return (
    <>
      <section className="home">
        <h1 className="home-heading">
          Unleash Your Creative Vision with Imaginify
        </h1>
        <ul className="sm:flex-center flex-wrap w-full gap-20">
          {navLinks.slice(1, 5).map((link) => (
            <Link
              key={link.route}
              href={link.route}
              className="flex-center flex-col gap-2"
            >
              <li className="flex-center w-fit rounded-full bg-white p-4">
                <Image src={link.icon} alt="image" width={24} height={24} />
              </li>
              <p className="p-14-medium text-center text-white">{link.label}</p>
            </Link>
          ))}
        </ul>
      </section>

      <SignedIn>
        <section className="sm:mt-12">
          <Collection
            hasSearch={true}
            images={images?.data}
            totalPages={images?.totalPage}
            page={page}
          />
        </section>
      </SignedIn>
    </>
  );
};

export default Home;
