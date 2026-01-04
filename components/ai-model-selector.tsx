"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Settings2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { AI_MODELS, getModelsByProvider, DEFAULT_MODEL } from "@/lib/ai/config"
import { AIModel, AIProvider } from "@/lib/ai/types"
import { Badge } from "@/components/ui/badge"

interface AIModelSelectorProps {
    onModelChange: (model: AIModel) => void;
    currentModel?: AIModel;
}

export function AIModelSelector({ onModelChange, currentModel = DEFAULT_MODEL }: AIModelSelectorProps) {
    const [open, setOpen] = React.useState(false)
    const [selectedModel, setSelectedModel] = React.useState<AIModel>(currentModel)

    const handleSelect = (model: AIModel) => {
        setSelectedModel(model)
        onModelChange(model)
        setOpen(false)
    }

    // Group models by provider
    const googleModels = getModelsByProvider('google')
    const groqModels = getModelsByProvider('groq')
    const openRouterModels = getModelsByProvider('openrouter')

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-slate-900/50 border-white/10 text-slate-200 hover:bg-slate-800 hover:text-white"
                >
                    <div className="flex items-center gap-2 truncate">
                        <Settings2 className="h-4 w-4 shrink-0 opacity-50" />
                        <span className="truncate flex-1 text-left">
                            {selectedModel.name}
                        </span>
                        <Badge variant="secondary" className="ml-2 text-[10px] h-5 px-1 bg-slate-700/50 text-slate-300 pointer-events-none uppercase">
                            {selectedModel.provider}
                        </Badge>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 bg-slate-900 border-slate-700 text-slate-200">
                <Command className="bg-transparent">
                    <CommandInput placeholder="Search models..." className="text-slate-200" />
                    <CommandList>
                        <CommandEmpty>No model found.</CommandEmpty>

                        <CommandGroup heading="Google Gemini">
                            {googleModels.map((model) => (
                                <CommandItem
                                    key={model.id}
                                    value={model.name}
                                    onSelect={() => handleSelect(model)}
                                    className="text-slate-300 aria-selected:bg-slate-800 aria-selected:text-white"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedModel.id === model.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span>{model.name}</span>
                                        {model.description && <span className="text-[10px] text-slate-500">{model.description}</span>}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>

                        <CommandGroup heading="Groq (Llama/Mixtral)">
                            {groqModels.map((model) => (
                                <CommandItem
                                    key={model.id}
                                    value={model.name}
                                    onSelect={() => handleSelect(model)}
                                    className="text-slate-300 aria-selected:bg-slate-800 aria-selected:text-white"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedModel.id === model.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span>{model.name}</span>
                                        {model.description && <span className="text-[10px] text-slate-500">{model.description}</span>}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>

                        <CommandGroup heading="OpenRouter">
                            {openRouterModels.map((model) => (
                                <CommandItem
                                    key={model.id}
                                    value={model.name}
                                    onSelect={() => handleSelect(model)}
                                    className="text-slate-300 aria-selected:bg-slate-800 aria-selected:text-white"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedModel.id === model.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span>{model.name}</span>
                                        {model.description && <span className="text-[10px] text-slate-500">{model.description}</span>}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>

                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
