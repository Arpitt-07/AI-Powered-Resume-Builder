import React from "react";


export interface EducationEntry {
  school: string;
  degree: string;
  location?: string;
  dates?: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  location?: string;
  dates?: string;
  bullets?: string[];
}

export interface ProjectEntry {
  title: string;
  stack?: string;
  date?: string;
  bullets?: string[];
}

export interface ResumeData {
  name?: string;
  summary?: string;
  location?: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  github?: string;
  education?: EducationEntry[];
  experience?: ExperienceEntry[];
  projects?: ProjectEntry[];
  technicalSkills?: Record<string, string>;
  certifications?: string[];
  achievements?: string[];
}

interface ResumeTemplateProps {
  data: ResumeData;
}

interface SectionTitleProps {
  children: React.ReactNode;
}

function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h2 className="text-[13px] font-bold uppercase tracking-wide border-b border-black pb-[2px] mb-2 mt-4">
      {children}
    </h2>
  );
}

interface BulletProps {
  children?: React.ReactNode;
}

function Bullet({ children }: BulletProps) {
  if (!children) return null;
  return (
    <li className="ml-4 list-disc marker:text-[8px] text-[11px] leading-[1.35] mb-[2px]">
      {children}
    </li>
  );
}

interface TwoColRowProps {
  left?: string;
  right?: string;
  italic?: boolean;
}

function TwoColRow({ left, right, italic = false }: TwoColRowProps) {
  return (
    <div className="flex justify-between items-baseline">
      <span className={italic ? "italic text-[11.5px]" : "font-bold text-[11.5px]"}>
        {left}
      </span>
      <span className={italic ? "italic text-[11px]" : "font-bold text-[11px]"}>
        {right}
      </span>
    </div>
  );
}

export default function ResumeTemplate({ data }: ResumeTemplateProps) {
  const {
    name = "",
    summary = "",
    location = "",
    phone = "",
    email = "",
    linkedin = "",
    github = "",
    education = [],
    experience = [],
    projects = [],
    technicalSkills = {},
    certifications = [],
    achievements = [],
  } = data || {};

  return (
    <div
      className="mx-auto bg-white text-black shadow-md"
      style={{
        width: "850px",
        minHeight: "1100px",
        padding: "48px 56px",
        fontFamily: "'Times New Roman', Georgia, serif",
      }}
    >
      <div className="text-center mb-4">
        {name && (
          <h1
            className="text-[26px] font-bold tracking-wide uppercase"
            style={{ fontVariant: "small-caps" }}
          >
            {name}
          </h1>
        )}
        {location && <p className="text-[12px] mt-[2px]">{location}</p>}

        <p className="text-[11.5px] mt-1 flex justify-center flex-wrap gap-x-3 gap-y-1">
          {phone && <span>📞 {phone}</span>}
          {email && (
            <a href={`mailto:${email}`} className="underline">
              ✉ {email}
            </a>
          )}
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noreferrer" className="underline">
              🔗 {linkedin.replace(/^https?:\/\//, "")}
            </a>
          )}
        </p>
        {github && (
          <p className="text-[11.5px] mt-[2px]">
            <a href={github} target="_blank" rel="noreferrer" className="underline">
              🔗 {github.replace(/^https?:\/\//, "")}
            </a>
          </p>
        )}
      </div>

      {summary && (
        <section className="mb-4">
          <p className="text-[11px] leading-[1.35] text-justify">
            {summary}
          </p>
        </section>
      )}

      {education.length > 0 && (
        <section>
          <SectionTitle>Education</SectionTitle>
          <div className="flex flex-col gap-2">
            {education.map((ed, i) => (
              <div key={i}>
                <TwoColRow left={ed.school} right={ed.dates} />
                <TwoColRow left={ed.degree} right={ed.location} italic />
              </div>
            ))}
          </div>
        </section>
      )}

      {experience.length > 0 && (
        <section>
          <SectionTitle>Experience</SectionTitle>
          <div className="flex flex-col gap-2">
            {experience.map((job, i) => (
              <div key={i}>
                <TwoColRow left={job.company} right={job.dates} />
                <TwoColRow left={job.role} right={job.location} italic />
                <ul className="mt-1">
                  {(job.bullets || []).map((b, j) => (
                    <Bullet key={j}>{b}</Bullet>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section>
          <SectionTitle>Projects</SectionTitle>
          <div className="flex flex-col gap-2">
            {projects.map((proj, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <span className="text-[11.5px]">
                    <strong>{proj.title}</strong>
                    {proj.stack && <em> {" "} | {proj.stack}</em>}
                  </span>
                  <span className="font-bold text-[11px]">{proj.date}</span>
                </div>
                <ul className="mt-1">
                  {(proj.bullets || []).map((b, j) => (
                    <Bullet key={j}>{b}</Bullet>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {Object.keys(technicalSkills).length > 0 && (
        <section>
          <SectionTitle>Technical Skills</SectionTitle>
          <table className="text-[11.5px]">
            <tbody>
              {Object.entries(technicalSkills).map(([label, value], i) => (
                <tr key={i}>
                  <td className="font-bold align-top pr-1 whitespace-nowrap">{label}</td>
                  <td className="align-top pr-1">:</td>
                  <td className="align-top">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {certifications.length > 0 && (
        <section>
          <SectionTitle>Certifications</SectionTitle>
          <ul>
            {certifications.map((c, i) => (
              <Bullet key={i}>{c}</Bullet>
            ))}
          </ul>
        </section>
      )}

      {achievements.length > 0 && (
        <section>
          <SectionTitle>Achievements</SectionTitle>
          <ul>
            {achievements.map((a, i) => (
              <Bullet key={i}>{a}</Bullet>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
