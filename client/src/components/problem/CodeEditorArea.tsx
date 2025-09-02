import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Editor from "@monaco-editor/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";

const CodeEditorArea = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Write Your Code Here");

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);

    const defaultCode: Record<string, string> = {
      javascript: "// Write Your JavaScript Code Here",
      java: "// Write Your Java Code Here",
      python: "// Write Your Python Code Here",
    };

    setCode(defaultCode[newLanguage] || "// Write Your Code Here");
  };
  return (
    <Card className="rounded-none h-full">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Code Editor</CardTitle>
          <CardDescription>Write Your Code Here</CardDescription>
        </div>
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="JavaScript" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="python">Python</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="h-full">
        <div className="group ring-border relative overflow-hidden rounded-lg ring-1">
          <Editor
            height={"380px"}
            language="javascript"
            defaultLanguage={language}
            value={code}
            theme="vs-dark"
            defaultValue="// Write Your Code Here"
            options={{
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },
              renderWhitespace: "selection",
              fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
              fontLigatures: true,
              cursorBlinking: "smooth",
              smoothScrolling: true,
              contextmenu: true,
              renderLineHighlight: "all",
              lineHeight: 1.6,
              letterSpacing: 0.5,
              roundedSelection: true,
              scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeEditorArea;
