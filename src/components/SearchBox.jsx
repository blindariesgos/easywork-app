"use client";
import { useState } from "react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import Image from "next/image";
import {
  DocumentPlusIcon,
  FolderIcon,
  FolderPlusIcon,
  HashtagIcon,
  MagnifyingGlassIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

const people = [
  {
    id: 1,
    name: "Leslie Alexander",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  // More users...
];
const projects = [
  { id: 1, name: "Workflow Inc. / Website Redesign", url: "#" },
  // More projects...
];
const recent = [projects[0]];
const quickActions = [
  { name: "Add new file...", icon: DocumentPlusIcon, shortcut: "N", url: "#" },
  { name: "Add new folder...", icon: FolderPlusIcon, shortcut: "F", url: "#" },
  { name: "Add hashtag...", icon: HashtagIcon, shortcut: "H", url: "#" },
  { name: "Add label...", icon: TagIcon, shortcut: "L", url: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SearchBox() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);

  const filteredPeople =
    query === ""
      ? people
      : people.filter((person) => {
        return person.name.toLowerCase().includes(query.toLowerCase());
      });

  const filteredProjects =
    query === ""
      ? []
      : projects.filter((project) => {
        return project.name.toLowerCase().includes(query.toLowerCase());
      });

  return (
    <form className="relative flex w-full" action="#" method="GET">
      <input
        id="search-field"
        className=" w-full h-8 my-auto rounded-xl border-0 py-0 pl-2 pr-8 text-black placeholder:text-primary focus:ring-0 sm:text-sm bg-gray-200 font-medium"
        placeholder={t('common:header:placeholder-search')}
        type="search"
        name="search"
      />
      <MagnifyingGlassIcon
        className="pointer-events-none absolute inset-y-0 right-2 h-full w-5 text-primary"
        aria-hidden="true"
      />
    </form>
  );
}
