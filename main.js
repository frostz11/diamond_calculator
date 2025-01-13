import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, Plus } from "lucide-react";

const API_URL = 'http://localhost:8000';

const DiamondCalculator = () => {
  const [groups, setGroups] = useState([createEmptyGroup()]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  function createEmptyGroup() {
    return {
      carat: 1.0,
      quantity: 1,
      cut: 'excellent',
      color: 'D',
      clarity: 'FL',
      certification: 'GIA'
    };
  }

  const handleAddGroup = () => {
    setGroups([...groups, createEmptyGroup()]);
  };

  const handleRemoveGroup = (index) => {
    const newGroups = groups.filter((_, i) => i !== index);
    setGroups(newGroups);
  };

  const handleGroupChange = (index, field, value) => {
    const newGroups = [...groups];
    newGroups[index] = { ...newGroups[index], [field]: value };
    setGroups(newGroups);
  };

  const calculateTotal = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groups })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Calculation failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Diamond Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {groups.map((group, index) => (
            <div key={index} className="mb-8 p-6 bg-slate-50 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Diamond Group {index + 1}</h3>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveGroup(index)}
                  disabled={groups.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Carat Weight</label>
                  <Input
                    type="number"
                    value={group.carat}
                    step="0.01"
                    min="0.1"
                    onChange={(e) => handleGroupChange(index, 'carat', parseFloat(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <Input
                    type="number"
                    value={group.quantity}
                    min="1"
                    onChange={(e) => handleGroupChange(index, 'quantity', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Cut Grade</label>
                  <Select
                    value={group.cut}
                    onValueChange={(value) => handleGroupChange(index, 'cut', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="very-good">Very Good</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Color Grade</label>
                  <Select
                    value={group.color}
                    onValueChange={(value) => handleGroupChange(index, 'color', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="D">D (Colorless)</SelectItem>
                      <SelectItem value="E">E (Colorless)</SelectItem>
                      <SelectItem value="F">F (Colorless)</SelectItem>
                      <SelectItem value="G">G (Near Colorless)</SelectItem>
                      <SelectItem value="H">H (Near Colorless)</SelectItem>
                      <SelectItem value="I">I (Near Colorless)</SelectItem>
                      <SelectItem value="J">J (Near Colorless)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Clarity Grade</label>
                  <Select
                    value={group.clarity}
                    onValueChange={(value) => handleGroupChange(index, 'clarity', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FL">FL (Flawless)</SelectItem>
                      <SelectItem value="IF">IF (Internally Flawless)</SelectItem>
                      <SelectItem value="VVS1">VVS1</SelectItem>
                      <SelectItem value="VVS2">VVS2</SelectItem>
                      <SelectItem value="VS1">VS1</SelectItem>
                      <SelectItem value="VS2">VS2</SelectItem>
                      <SelectItem value="SI1">SI1</SelectItem>
                      <SelectItem value="SI2">SI2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Certification</label>
                  <Select
                    value={group.certification}
                    onValueChange={(value) => handleGroupChange(index, 'certification', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GIA">GIA (Gemological Institute of America)</SelectItem>
                      <SelectItem value="AGS">AGS (American Gem Society)</SelectItem>
                      <SelectItem value="IGI">IGI (International Gemological Institute)</SelectItem>
                      <SelectItem value="HRD">HRD (Hoge Raad voor Diamant)</SelectItem>
                      <SelectItem value="uncertified">Uncertified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-4">
            <Button onClick={handleAddGroup} className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Diamond Group
            </Button>
            <Button onClick={calculateTotal} variant="default">
              Calculate Total Value
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.results.map((result) => (
                <div key={result.group_id} className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Group {result.group_id}</h4>
                  <div className="space-y-1 text-sm">
                    <p>Price per Diamond: ${result.per_diamond.toLocaleString()}</p>
                    <p>Quantity: {result.details.quantity}</p>
                    <p>Group Total: ${result.total.toLocaleString()}</p>
                    <p>Specifications: {result.details.carat}ct, {result.details.color}, {result.details.clarity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-2xl font-bold text-primary">
                Grand Total: ${results.grand_total.toLocaleString()}
              </h3>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DiamondCalculator;