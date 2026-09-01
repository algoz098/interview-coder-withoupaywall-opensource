const fs = require('fs');
const content = fs.readFileSync('src/components/Settings/SettingsDialog.tsx', 'utf8');

const search = "export function SettingsDialog({ open: externalOpen, onOpenChange }: SettingsDialogProps) {";
const replacement = `interface SettingsDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SettingsDialog({ open: externalOpen, onOpenChange }: SettingsDialogProps) {`;

if (content.includes(search)) {
  const newContent = content.replace(search, replacement);
  fs.writeFileSync('src/components/Settings/SettingsDialog.tsx', newContent);
  console.log("Patched successfully");
} else {
  console.log("Could not find pattern");
}
