import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import { uploadImage } from "../common/aws";

const uploadImageByFile = async (e) => {
  try {
    const url = await uploadImage(e);

    if (!url) {
      throw new Error("No se pudo obtener la URL de la imagen");
    }

    return {
      success: 1,
      file: { url },
    };
  } catch (error) {
    console.error("Error en uploadImageByFile:", error.message);
    return {
      success: 0,
      message: error.message,
    };
  }
};

const uploadImageByUrl = async (url) => {
  try {
    // Validación básica
    if (!url || typeof url !== "string") {
      throw new Error("URL vacía o inválida");
    }

    if (!url.startsWith("http")) {
      throw new Error("La URL debe comenzar con http o https");
    }

    // Comprueba que la imagen existe
    const res = await fetch(url, { method: "HEAD" });
    if (!res.ok) {
      throw new Error("No se pudo acceder a la imagen");
    }

    return {
      success: 1,
      file: { url },
    };
  } catch (error) {
    console.error("Error en uploadImageByUrl:", error.message);

    return {
      success: 0,
      message: error.message,
    };
  }
};

/* Herramientas */
export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByUrl,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  header: {
    class: Header,
    config: {
      placeholder: "Encabezado",
      levels: [2, 3],
      defaultLevel: 2,
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: "Cita",
      captionPlaceholder: "Autor",
    },
  },
  marker: Marker,
  inlineCode: InlineCode,
};

/* Para poner editorjs en español */
export const editorI18nEs = {
  messages: {
    ui: {
      blockTunes: {
        toggler: {
          "Click to tune": "Haz clic para configurar",
          "or drag to move": "o arrastra para mover",
        },
      },
      inlineToolbar: {
        converter: {
          "Convert to": "Convertir a",
        },
      },
      toolbar: {
        toolbox: {
          Add: "Agregar",
        },
      },
      popover: {
        Filter: "Filtrar",
        "Nothing found": "No se encontró nada",
        Create: "Crear",
      },
    },
    toolNames: {
      Text: "Texto",
      Heading: "Encabezado",
      List: "Lista",
      Warning: "Advertencia",
      Checklist: "Checklist",
      Quote: "Cita",
      Code: "Código",
      Delimiter: "Separador",
      "Raw HTML": "HTML",
      Table: "Tabla",
      Link: "Enlace",
      Image: "Imagen",
      Marker: "Marcar",
      InlineCode: "Codigo",
      Bold: "Negrita",
      Italic: "Cursiva",
    },
    tools: {
      warning: {
        Title: "Título",
        Message: "Mensaje",
      },
      link: {
        "Add a link": "Agregar un enlace",
      },
      stub: {
        "The block can not be displayed correctly.":
          "El bloque no se puede mostrar correctamente.",
      },
      table: {
        "Add column to left": "Agregar columna a la izquierda",
        "Add column to right": "Agregar columna a la derecha",
        "Delete column": "Eliminar columna",
        "Add row above": "Agregar fila arriba",
        "Add row below": "Agregar fila abajo",
        "Delete row": "Eliminar fila",
      },
      list: {
        Unordered: "Desordenado",
        Ordered: "Ordenado",
      },
      header: {
        "Heading 1": "Encabezado 1",
        "Heading 2": "Encabezado 2",
        "Heading 3": "Encabezado 3",
        "Heading 4": "Encabezado 4",
        "Heading 5": "Encabezado 5",
        "Heading 6": "Encabezado 6",
      },
      image: {
        "Select an Image": "Selecciona una Imagen",
        "With border": "Con Borde",
        "Stretch image": "Estirar imagen",
        "With background": "Con fondo",
      },
      quote: {
        "Enter a quote": "Cita",
        "Enter a caption": "Autor",
        "Align Left": "Alinear izquierda",
        "Align Center": "Alinear centro",
      },
    },
    blockTunes: {
      delete: {
        Delete: "Eliminar",
        "Click to delete": "Confirmar eliminar",
      },
      moveUp: {
        "Move up": "Mover arriba",
      },
      moveDown: {
        "Move down": "Mover abajo",
      },
    },
  },
};
