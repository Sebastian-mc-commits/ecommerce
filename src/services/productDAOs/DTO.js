import { productDbEnum } from "../../utils/enums/databaseValues.enum.js";

export default class ProductDTO {
  constructor(product) {
    this.id = product.id;

    for (key in product) {
      this[productDbEnum[key] || key] = product[key];
    }
  }
}
