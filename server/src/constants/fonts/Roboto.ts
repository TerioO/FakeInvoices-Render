import { TFontDictionary } from "pdfmake/interfaces";
import { getAbsSrcDir } from "../../path";

const src = getAbsSrcDir();

export const RobotoFont: TFontDictionary = {
    "Roboto": {
        normal: `${src}/constants/fonts/ttfs/Roboto-Regular.ttf`,
        bold: `${src}/ttfs/Roboto-Bold.ttf`,
        italics: `${src}/ttfs/Roboto-Italic.ttf`
    }
};