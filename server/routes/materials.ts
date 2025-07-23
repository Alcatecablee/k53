import { RequestHandler } from "express";

// Get study material by ID
export const getMaterial: RequestHandler = async (req, res) => {
  try {
    const { materialId } = req.params;

    if (!materialId) {
      return res.status(400).json({ error: "Material ID is required" });
    }

    // Mock materials data
    const materials: Record<string, any> = {
      "k53-handbook": {
        id: "k53-handbook",
        title: "K53 Learner's Guide",
        type: "pdf",
        size: "2.4 MB",
        description: "Official K53 learner's guide and handbook",
        downloadUrl: "/materials/k53-handbook.pdf",
      },
      "road-signs": {
        id: "road-signs",
        title: "Road Signs Reference",
        type: "pdf",
        size: "1.8 MB",
        description: "Complete road signs reference guide",
        downloadUrl: "/materials/road-signs.pdf",
      },
      "rules-of-road": {
        id: "rules-of-road",
        title: "Rules of the Road",
        type: "pdf",
        size: "3.1 MB",
        description: "Complete rules of the road manual",
        downloadUrl: "/materials/rules-of-road.pdf",
      },
    };

    const material = materials[materialId];

    if (!material) {
      return res.status(404).json({ error: "Material not found" });
    }

    res.json({
      success: true,
      material,
      message: "Material information retrieved successfully",
    });
  } catch (error) {
    console.error("Get material error:", error);
    res.status(500).json({ error: "Failed to get material" });
  }
};

// List all available materials
export const listMaterials: RequestHandler = async (req, res) => {
  try {
    const materials = [
      {
        id: "k53-handbook",
        title: "K53 Learner's Guide",
        type: "pdf",
        size: "2.4 MB",
        description: "Official K53 learner's guide and handbook",
      },
      {
        id: "road-signs",
        title: "Road Signs Reference",
        type: "pdf",
        size: "1.8 MB",
        description: "Complete road signs reference guide",
      },
      {
        id: "rules-of-road",
        title: "Rules of the Road",
        type: "pdf",
        size: "3.1 MB",
        description: "Complete rules of the road manual",
      },
    ];

    res.json({
      success: true,
      materials,
      count: materials.length,
    });
  } catch (error) {
    console.error("List materials error:", error);
    res.status(500).json({ error: "Failed to list materials" });
  }
};
