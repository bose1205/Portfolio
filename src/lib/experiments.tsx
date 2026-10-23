import type { ComponentType } from "react";
import { Toggle } from "@/components/experiments/toggle";
import { UploadButton } from "@/components/experiments/upload-button";
import { AvatarGroup } from "@/components/experiments/avatar-group";
import { SearchBox } from "@/components/experiments/search-box";

export type Experiment = {
  id: string;
  title: string;
  description: string;
  // Omit `Demo` to render an empty stage (work in progress).
  Demo?: ComponentType;
};

// Add a new experiment by creating a component in components/experiments
// and appending an entry here.
export const experiments: Experiment[] = [
  { id: "toggle", title: "Toggle", description: "Smooth transition of toggle states", Demo: Toggle },
  { id: "upload-button", title: "Button animation", description: "Smooth transition of states", Demo: UploadButton },
  { id: "search-box", title: "Search box", description: "Interactions in a search box", Demo: SearchBox },
  { id: "avatar-group", title: "Avatar hover", description: "Lift, focus and tooltip on hover", Demo: AvatarGroup },
  { id: "button-5", title: "Button animation", description: "Smooth transition of states" },
  { id: "button-6", title: "Button animation", description: "Smooth transition of states" },
  { id: "button-7", title: "Button animation", description: "Smooth transition of states" },
  { id: "button-8", title: "Button animation", description: "Smooth transition of states" },
];
