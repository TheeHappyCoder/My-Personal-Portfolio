"use client";

import { ChevronRight, Grid2X2, Search, Wrench } from "lucide-react";
import { useState } from "react";
import { skillGroups } from "@/data/portfolio";

export function SkillsApp() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="skills-app">
      <aside>
        <div className="settings-profile"><div>MS</div><span><b>Mark Steyn</b><small>System integrator / developer</small></span></div>
        <label className="settings-search"><Search size={15} /><input aria-label="Find a skill" placeholder="Find a skill" /></label>
        <nav>{skillGroups.map((group, index) => <button className={selected === index ? "selected" : ""} type="button" key={group.title} onClick={() => setSelected(index)}><Grid2X2 size={16} />{group.title}</button>)}</nav>
      </aside>
      <main>
        <p className="settings-path">Skills <ChevronRight size={13} /> {skillGroups[selected].title}</p>
        <h2>{skillGroups[selected].title}</h2>
        <p className="settings-intro">{skillGroups[selected].description}</p>
        <div className="skill-settings-list">
          {skillGroups[selected].skills.map((skill, index) => (
            <div key={skill}><span className="skill-glyph">{skill.slice(0, 2).toUpperCase()}</span><div><b>{skill}</b><small>{index < 3 ? "Frequent tool" : "Working knowledge"}</small></div><ChevronRight size={16} /></div>
          ))}
        </div>
        <div className="skill-footnote"><Wrench size={17} /><span><b>No fake percentage bars.</b><small>Skills grow through shipped work, not arbitrary 93% ratings.</small></span></div>
      </main>
    </div>
  );
}
