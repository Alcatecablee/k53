import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { imageMapping, getImagesByCategory } from '@/data/imageMapping';

interface StudySection {
  title: string;
  description: string;
  images: any[];
  learningPoints: string[];
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

export function ImageStudyGuide() {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof imageMapping>('signs');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'basic' | 'intermediate' | 'advanced'>('all');

  const createStudySections = (category: keyof typeof imageMapping): StudySection[] => {
    const images = getImagesByCategory(category);
    
    if (category === 'signs') {
      return [
        {
          title: 'Regulatory Signs',
          description: 'Signs that give orders and must be obeyed',
          images: images.filter(img => img.context?.includes('regulatory')),
          learningPoints: [
            'Red circular signs with white symbols indicate prohibitions',
            'Blue circular signs with white symbols indicate mandatory actions',
            'Always obey regulatory signs - they are legally enforceable',
            'Common regulatory signs include stop, yield, speed limits, and no entry'
          ],
          difficulty: 'basic'
        },
        {
          title: 'Warning Signs',
          description: 'Signs that warn of hazards ahead',
          images: images.filter(img => img.context?.includes('warning')),
          learningPoints: [
            'Yellow diamond-shaped signs warn of potential hazards',
            'Reduce speed and be prepared to stop when approaching warning signs',
            'Common warnings include curves, intersections, and pedestrian crossings',
            'Warning signs help you anticipate and react to road conditions'
          ],
          difficulty: 'basic'
        },
        {
          title: 'Information Signs',
          description: 'Signs that provide useful information',
          images: images.filter(img => img.context?.includes('information')),
          learningPoints: [
            'Blue rectangular signs provide information about services and facilities',
            'Green signs indicate directions and distances',
            'Information signs help with navigation and finding services',
            'Tourism signs are brown and guide visitors to attractions'
          ],
          difficulty: 'intermediate'
        }
      ];
    }
    
    if (category === 'controls') {
      return [
        {
          title: 'Primary Controls',
          description: 'Essential vehicle controls for basic operation',
          images: images.filter(img => 
            img.context?.some(ctx => ['steering', 'braking', 'gear-change'].includes(ctx))
          ),
          learningPoints: [
            'Steering wheel controls direction - use both hands in the 10 and 2 position',
            'Brake pedal slows and stops the vehicle - apply gradually',
            'Accelerator controls speed - use smooth, controlled movements',
            'Clutch pedal (manual) disengages engine from wheels for gear changes'
          ],
          difficulty: 'basic'
        },
        {
          title: 'Secondary Controls',
          description: 'Additional controls for vehicle operation',
          images: images.filter(img => 
            img.context?.some(ctx => ['signaling', 'mirrors', 'parking'].includes(ctx))
          ),
          learningPoints: [
            'Indicators signal your intention to turn or change lanes',
            'Mirrors provide visibility of surrounding traffic',
            'Parking brake secures the vehicle when stationary',
            'Dashboard instruments monitor vehicle status and performance'
          ],
          difficulty: 'basic'
        }
      ];
    }
    
    if (category === 'scenarios') {
      return [
        {
          title: 'Urban Driving',
          description: 'Common scenarios in city and town driving',
          images: images.filter(img => 
            img.context?.some(ctx => ['intersection', 'pedestrian', 'school-zone'].includes(ctx))
          ),
          learningPoints: [
            'Intersections require careful observation and right-of-way understanding',
            'Pedestrian crossings demand extra caution and stopping when necessary',
            'School zones have reduced speed limits during specific times',
            'Urban driving requires constant awareness of multiple road users'
          ],
          difficulty: 'intermediate'
        },
        {
          title: 'Highway Driving',
          description: 'High-speed road scenarios and considerations',
          images: images.filter(img => img.context?.includes('highway')),
          learningPoints: [
            'Highway driving requires higher speeds and longer stopping distances',
            'Lane discipline is crucial for safe highway travel',
            'Overtaking requires careful planning and adequate space',
            'Emergency stops on highways require immediate hazard warning'
          ],
          difficulty: 'advanced'
        }
      ];
    }
    
    return [];
  };

  const sections = createStudySections(selectedCategory);
  const filteredSections = selectedDifficulty === 'all' 
    ? sections 
    : sections.filter(section => section.difficulty === selectedDifficulty);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">K53 Image Study Guide</h1>
        <p className="text-slate-300">
          Learn K53 content through organized image collections with explanations
        </p>
      </div>

      {/* Category Selection */}
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.keys(imageMapping).map(cat => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(cat as keyof typeof imageMapping)}
            className="capitalize"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Difficulty Filter */}
      <div className="flex justify-center">
        <div className="flex gap-2">
          {(['all', 'basic', 'intermediate', 'advanced'] as const).map(diff => (
            <Button
              key={diff}
              variant={selectedDifficulty === diff ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDifficulty(diff)}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Study Sections */}
      <div className="space-y-6">
        {filteredSections.map((section, index) => (
          <Card key={index} className="bg-slate-800 border-slate-600">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">{section.title}</CardTitle>
                  <p className="text-slate-300 mt-1">{section.description}</p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {section.difficulty}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Learning Points */}
              <div>
                <h4 className="text-white font-semibold mb-3">Key Learning Points:</h4>
                <ul className="space-y-2">
                  {section.learningPoints.map((point, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-slate-400 mt-1">•</span>
                      <span className="text-slate-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Images */}
              {section.images.length > 0 && (
                <div>
                  <h4 className="text-white font-semibold mb-3">
                    Related Images ({section.images.length}):
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {section.images.slice(0, 8).map((image, i) => (
                      <div key={i} className="aspect-square overflow-hidden rounded-lg border border-slate-600">
                        <img
                          src={image.path}
                          alt={image.description || image.filename}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  {section.images.length > 8 && (
                    <p className="text-slate-400 text-sm mt-2">
                      +{section.images.length - 8} more images
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSections.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">
            No study sections available for the selected category and difficulty.
          </p>
        </div>
      )}

      {/* Quick Reference */}
      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Quick Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-white font-semibold mb-2">Study Tips:</h4>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>• Review images regularly to build recognition</li>
                <li>• Practice identifying signs and controls quickly</li>
                <li>• Understand the context and meaning of each image</li>
                <li>• Test yourself with the image quiz feature</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Progression:</h4>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>• Start with basic difficulty images</li>
                <li>• Move to intermediate as you master basics</li>
                <li>• Advanced images test complex scenarios</li>
                <li>• Regular practice improves retention</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
