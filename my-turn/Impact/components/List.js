import { mockData } from "../data.js";
import { Item } from "./Item.js";

const List = {
  type: 'ul',
  props: {
    children: mockData.map(Item)
  }
}

export default List
