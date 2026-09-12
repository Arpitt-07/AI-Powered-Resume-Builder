"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema } from "@/lib/zod-schemas";
import { useUpdateResume } from "@/services/resume.service";
import { aiService } from "@/services/ai.service";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { UIResume } from "@/types/form.types";
import { IResume } from "@/types/resume.types";
import { motion, AnimatePresence } from "framer-motion";
import { useResumeStore } from "@/store/resume-store";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { DotsSixVertical } from "@phosphor-icons/react";

import GeneralSection from "./sections/general-section";
import PersonalSection from "./sections/personal-section";
import ExperienceSection from "./sections/experience-section";
import EducationSection from "./sections/education-section";
import ProjectSection from "./sections/project-section";
import SkillsSection from "./sections/skills-section";
import SectionBlock from "./section-block";

interface ResumeFormProps {
  resumeId: string;
  initialData: Partial<IResume>;
}

const stringToArray = (str: unknown) => {
  if (Array.isArray(str)) return str;
  if (typeof str === 'string') {
    return str.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

export default function ResumeForm({ resumeId, initialData }: ResumeFormProps) {
  const [aiSuggestion, setAiSuggestion] = useState<{ field: string; value: string } | null>(null);

  const {
    resumeData,
    sectionOrder,
    saveStatus,
    setResumeData,
    setSaveStatus,
    moveSection,
    activeSection,
    setActiveSection
  } = useResumeStore();

  const { mutate: updateResume, isPending: isSaving } = useUpdateResume();
  const { mutate: generateSummary, isPending: isGeneratingSummary } = aiService.useGenerateSummary();
  const { mutate: improveContent, isPending: isImproving } = aiService.useImproveContent();

  const transformToBackend = (uiData: UIResume): Partial<IResume> => {
    return {
      ...uiData,
      skills: stringToArray(uiData.skills),
      certifications: stringToArray(uiData.certifications),
      projects: uiData.projects?.map((p) => ({
        ...p,
        techStack: stringToArray(p.techStack),
      })),
    };
  };

  const transformFromBackend = (data: Partial<IResume>): UIResume => {
    const arrayToString = (arr: string[] | undefined) => arr ? arr.join(", ") : "";

    return {
      title: data.title || "",
      summary: data.summary || "",
      personalInfo: {
        fullname: data.personalInfo?.fullname || "",
        email: data.personalInfo?.email || "",
        phone: data.personalInfo?.phone || "",
        location: data.personalInfo?.location || "",
        linkedIn: data.personalInfo?.linkedIn || "",
        github: data.personalInfo?.github || "",
        portfolio: data.personalInfo?.portfolio || "",
      },
      workExperience: data.workExperience || [],
      education: data.education || [],
      projects: (data.projects || []).map(p => ({
        ...p,
        techStack: arrayToString(p.techStack),
      })),
      skills: arrayToString(data.skills),
      certifications: arrayToString(data.certifications),
    };
  };

  const methods = useForm<UIResume>({
    resolver: zodResolver(resumeSchema) as unknown as import("react-hook-form").Resolver<UIResume>,
    defaultValues: transformFromBackend(initialData),
  });

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = methods;

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control,
    name: "workExperience"
  });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control,
    name: "education"
  });
  const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({
    control,
    name: "projects"
  });

  useEffect(() => {
    const subscription = methods.watch((value) => {
      const timer = setTimeout(() => {
        const uiData = value as UIResume;
        const payload = transformToBackend(uiData);

        setResumeData(payload);

        updateResume({ id: resumeId, data: payload }, {
          onSuccess: () => {
             setSaveStatus("success");
             setTimeout(() => setSaveStatus("idle"), 2000);
          },
          onError: (err: Error) => {
            console.error("Autosave failed:", err);
            setSaveStatus("error");
          },
        });
      }, 1000);
      return () => clearTimeout(timer);
    });
    return () => subscription.unsubscribe();
  }, [methods, resumeId, updateResume, setResumeData, setSaveStatus]);

  const handleGenerateSummary = async () => {
    const data = methods.getValues();
    const expString = data.workExperience
      ?.map((e) => `${e.title} at ${e.company}: ${e.description}`)
      .join("\n") || "No experience provided";

    generateSummary(
      {
        experience: expString,
        skills: stringToArray(data.skills),
        jobTitle: data.title,
      },
      {
        onSuccess: (val: string) => setAiSuggestion({ field: "summary", value: val }),
        onError: (err: Error) => alert(err.message),
      }
    );
  };

  const handleImproveContent = async (field: string, value: string) => {
    improveContent(
      { content: value },
      {
        onSuccess: (val: string) => setAiSuggestion({ field, value: val }),
        onError: (err: Error) => alert(err.message),
      }
    );
  };

  const acceptSuggestion = () => {
    if (aiSuggestion) {
      setValue(aiSuggestion.field as any, aiSuggestion.value, {
        shouldValidate: true,
        shouldDirty: true
      });
      setAiSuggestion(null);
    }
  };

  const onManualSave = (data: UIResume) => {
    setSaveStatus("saving");
    const payload = transformToBackend(data);
    updateResume({ id: resumeId, data: payload }, {
      onSuccess: () => {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      },
      onError: () => setSaveStatus("error"),
    });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    moveSection(result.source.index, result.destination.index);
  };

  const renderSection = (section: string, index: number) => {
    const isActive = activeSection === section;
    const handleFocus = () => setActiveSection(section);

    switch (section) {
      case 'general':
        return (
          <GeneralSection
            index={index}
            isActive={isActive}
            onFocus={handleFocus}
            methods={methods}
            handleGenerateSummary={handleGenerateSummary}
            handleImproveContent={handleImproveContent}
            isGeneratingSummary={isGeneratingSummary}
            isImproving={isImproving}
          />
        );
      case 'personal':
        return (
          <PersonalSection
            index={index}
            isActive={isActive}
            onFocus={handleFocus}
            methods={methods}
          />
        );
      case 'workExperience':
        return (
          <ExperienceSection
            index={index}
            isActive={isActive}
            onFocus={handleFocus}
            methods={methods}
            handleImproveContent={handleImproveContent}
            isImproving={isImproving}
          />
        );
      case 'education':
        return (
          <EducationSection
            index={index}
            isActive={isActive}
            onFocus={handleFocus}
            methods={methods}
          />
        );
      case 'projects':
        return (
          <ProjectSection
            index={index}
            isActive={isActive}
            onFocus={handleFocus}
            methods={methods}
            handleImproveContent={handleImproveContent}
            isImproving={isImproving}
          />
        );
      case 'skills':
        return (
          <SkillsSection
            index={index}
            isActive={isActive}
            onFocus={handleFocus}
            methods={methods}
          />
        );
      default:
        return null;
    }
  };


  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onManualSave)}
        className="space-y-12"
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-12">
                <AnimatePresence>
                  {aiSuggestion && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="fixed bottom-8 right-8 p-6 bg-surface border border-border rounded-mono shadow-2xl z-50 max-w-md"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-foreground">AI Suggestion</h4>
                        <Button variant="ghost" onClick={() => setAiSuggestion(null)} className="p-1 h-8 w-8">×</Button>
                      </div>
                      <p className="text-sm text-muted mb-4 leading-relaxed">{aiSuggestion.value}</p>
                      <div className="flex gap-3">
                        <Button variant="secondary" className="flex-1" onClick={() => setAiSuggestion(null)}>Discard</Button>
                        <Button className="flex-1" onClick={acceptSuggestion}>Accept</Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {sectionOrder.map((section, index) => (
                  <Draggable key={section} draggableId={section} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="relative"
                      >
                        <div {...provided.dragHandleProps} className="absolute -left-8 top-4 cursor-grab active:cursor-grabbing text-muted hover:text-foreground z-20">
                          <DotsSixVertical size={20} />
                        </div>
                        {renderSection(section, index)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="flex justify-end items-center gap-6 pt-8 border-t border-border">
          <div className="flex items-center gap-3">
            {saveStatus === "saving" && (
              <div className="flex items-center gap-2 text-xs text-muted animate-pulse">
                <div className="w-1.5 h-1.5 bg-muted rounded-full" />
                Saving changes...
              </div>
            )}
            {saveStatus === "success" && (
              <div className="flex items-center gap-2 text-xs text-accent-green-text animate-in fade-in duration-500">
                <div className="w-1.5 h-1.5 bg-accent-green-text rounded-full" />
                Changes synchronized
              </div>
            )}
            {saveStatus === "error" && (
              <div className="flex items-center gap-2 text-xs text-accent-red-text">
                <div className="w-1.5 h-1.5 bg-accent-red-text rounded-full" />
                Sync failed
              </div>
            )}
            {saveStatus === "idle" && (
              <span className="text-xs text-muted">Autosaved</span>
            )}
          </div>
          <Button type="submit" isLoading={isSaving} className="rounded-mono">
            Save Resume
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
