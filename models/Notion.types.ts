export type TitleObject = {
  id: string,
  type: 'title',
  title: Array<{ plain_text: string }>
}

export type RichTextObject = {
  id: string,
  type: 'rich_text',
  rich_text: Array<{ plain_text: string }>
}

export type NumberObject = {
  type: "number";
  number: number | null;
  id: string;
}

export type DateObject = {
  type: "date";
  date: string | null;
  id: string;
}

export type SelectObject<T> = {
  type: 'select';
  select: {
    id: string;
    name: T;
    color: string;
  }
}

export type MultiSelectObject = {
  id: string;
  type: 'multi_select',
  multi_select: SelectObject<string>['select'][]
}

export type FormulaObject = {
  type: "formula";
  formula: {
      type: "number";
      number: number | null;
  } 
}

export type PropertyType = DateObject | FormulaObject | NumberObject | TitleObject | SelectObject<any> | RichTextObject | MultiSelectObject;

export type DBResult  = Array<{
  id: string;
  properties: Record<string, PropertyType>
}>