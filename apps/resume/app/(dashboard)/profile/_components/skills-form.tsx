'use client';

import { useState } from 'react';
import { Button } from '@repo/design-system/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@repo/design-system/components/ui/collapsible';
import { Badge } from '@repo/design-system/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Code, 
  Tag,
  X
} from 'lucide-react';
import { useProfileStore } from '../../../../stores/profile-store';
import { Skill } from '../../../../types/profile';

export function SkillsForm() {
  const { 
    profile, 
    addSkill, 
    updateSkillItem,
    removeSkill,
    errors 
  } = useProfileStore();

  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0])); // First item open by default

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const getFieldError = (field: string): string | undefined => {
    return errors[field]?.[0];
  };

  const handleAddSkillCategory = () => {
    const newSkillCategory: Skill = {
      id: crypto.randomUUID(),
      category: '',
      items: [],
    };
    
    addSkill(newSkillCategory);
    
    // Open the newly added item
    const newIndex = profile.skills.length;
    setOpenItems(prev => new Set([...prev, newIndex]));
  };

  const handleUpdateSkillCategory = (index: number, updates: Partial<Skill>) => {
    updateSkillItem(index, updates);
  };

  const handleRemoveSkillCategory = (index: number) => {
    removeSkill(index);
    // Remove from open items
    const newOpenItems = new Set(openItems);
    newOpenItems.delete(index);
    setOpenItems(newOpenItems);
  };

  const handleAddSkillItem = (categoryIndex: number, skillName: string) => {
    if (!skillName.trim()) return;
    
    const category = profile.skills[categoryIndex];
    const updatedItems = [...category.items, skillName.trim()];
    handleUpdateSkillCategory(categoryIndex, { items: updatedItems });
  };

  const handleRemoveSkillItem = (categoryIndex: number, skillIndex: number) => {
    const category = profile.skills[categoryIndex];
    const updatedItems = category.items.filter((_, i) => i !== skillIndex);
    handleUpdateSkillCategory(categoryIndex, { items: updatedItems });
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, categoryIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      handleAddSkillItem(categoryIndex, input.value);
      input.value = '';
    }
  };

  const handleBulkSkillsUpdate = (categoryIndex: number, skillsText: string) => {
    // Parse comma-separated skills
    const skills = skillsText
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
    
    handleUpdateSkillCategory(categoryIndex, { items: skills });
  };

  const getBulkSkillsText = (categoryIndex: number): string => {
    const category = profile.skills[categoryIndex];
    return category.items.join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Existing Skill Categories */}
      {profile.skills.length > 0 && (
        <div className="space-y-4">
          {profile.skills.map((skillCategory, index) => (
            <Card key={skillCategory.id || index} className="border-l-4 border-l-green-500">
              <Collapsible open={openItems.has(index)} onOpenChange={() => toggleItem(index)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-left">
                        <Code className="h-5 w-5 text-gray-500" />
                        <div>
                          <CardTitle className="text-lg">
                            {skillCategory.category || 'New Skill Category'}
                          </CardTitle>
                          <CardDescription className="flex items-center space-x-2 mt-1">
                            {skillCategory.items.length > 0 && (
                              <span className="flex items-center">
                                <Tag className="h-3 w-3 mr-1" />
                                {skillCategory.items.length} skill{skillCategory.items.length !== 1 ? 's' : ''}
                              </span>
                            )}
                            {skillCategory.items.length > 0 && (
                              <span className="text-xs text-gray-400">
                                {skillCategory.items.slice(0, 3).join(', ')}
                                {skillCategory.items.length > 3 && '...'}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveSkillCategory(index);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {openItems.has(index) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="space-y-6 pt-0">
                    {/* Category Name */}
                    <div className="space-y-2">
                      <Label htmlFor={`category-${index}`}>Category Name *</Label>
                      <Input
                        id={`category-${index}`}
                        type="text"
                        value={skillCategory.category}
                        onChange={(e) => handleUpdateSkillCategory(index, { category: e.target.value })}
                        placeholder="e.g., Programming Languages, Frameworks, Tools"
                        className={getFieldError(`skills.${index}.category`) ? 'border-red-500' : ''}
                      />
                      {getFieldError(`skills.${index}.category`) && (
                        <p className="text-sm text-red-600">{getFieldError(`skills.${index}.category`)}</p>
                      )}
                    </div>

                    {/* Skills Items - Two Input Methods */}
                    <div className="space-y-4">
                      <Label>Skills in this Category</Label>
                      
                      {/* Method 1: Bulk Comma-Separated Input */}
                      <div className="space-y-2">
                        <Label htmlFor={`bulk-skills-${index}`} className="text-sm font-normal">
                          Comma-separated list:
                        </Label>
                        <Input
                          id={`bulk-skills-${index}`}
                          type="text"
                          value={getBulkSkillsText(index)}
                          onChange={(e) => handleBulkSkillsUpdate(index, e.target.value)}
                          placeholder="e.g., React, Vue.js, Angular, Svelte"
                          className="font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500">
                          Type skills separated by commas. Changes save automatically.
                        </p>
                      </div>

                      {/* Method 2: Individual Skill Input */}
                      <div className="space-y-2">
                        <Label htmlFor={`single-skill-${index}`} className="text-sm font-normal">
                          Or add skills one by one:
                        </Label>
                        <Input
                          id={`single-skill-${index}`}
                          type="text"
                          placeholder="Type a skill and press Enter"
                          onKeyPress={(e) => handleSkillKeyPress(e, index)}
                        />
                        <p className="text-xs text-gray-500">
                          Press Enter to add each skill individually.
                        </p>
                      </div>

                      {/* Current Skills Display */}
                      {skillCategory.items.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm font-normal">Current skills:</Label>
                          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md border">
                            {skillCategory.items.map((skill, skillIndex) => (
                              <Badge
                                key={skillIndex}
                                variant="secondary"
                                className="cursor-pointer hover:bg-red-100 transition-colors"
                                onClick={() => handleRemoveSkillItem(index, skillIndex)}
                              >
                                {skill}
                                <X className="h-3 w-3 ml-1" />
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500">
                            Click on any skill badge to remove it.
                          </p>
                        </div>
                      )}

                      {/* Empty State for Skills */}
                      {skillCategory.items.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-md">
                          <Tag className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">No skills added to this category yet</p>
                          <p className="text-xs text-gray-400 mt-1">Use either input method above to add skills</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      )}

      {/* Add Skill Category Button - Only show when there are existing categories */}
      {profile.skills.length > 0 && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={handleAddSkillCategory}
            size="lg"
            className="w-full max-w-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Skill Category
          </Button>
        </div>
      )}

      {/* Empty State - Only show when no skills */}
      {profile.skills.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Code className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No skill categories added</h3>
            <p className="text-gray-600 mb-6">
              Start organizing your skills by creating categories like "Programming Languages", "Frameworks", or "Tools".
            </p>
            <Button onClick={handleAddSkillCategory} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Skill Category
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}