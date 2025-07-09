import { Loader2 } from "lucide-react";
import React from "react";

const Loader: React.FC = () => (
  <div className="flex justify-center items-center py-4">
    <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
  </div>
);

export default Loader;
