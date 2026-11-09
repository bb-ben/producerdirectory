export type DirectoryEntry=Record<string,string>;
export type ProductGroup={id:string;label:string;description:string;terms:string[]};
export type FoodCategory={id:string;label:string;description:string;icon:string;color:string;groups:ProductGroup[]};
export const foodCategories:FoodCategory[]=[
 {id:'meat',label:'Meat',description:'Beef, pork, lamb and bison.',icon:'beef',color:'clay',groups:[
  {id:'beef',label:'Beef',description:'Beef products and related sourcing records.',terms:['beef']},
  {id:'pork',label:'Pork & pigs',description:'Pork products and pig producers.',terms:['pork','swine','sows']},
  {id:'lamb',label:'Lamb & sheep',description:'Lamb products and sheep producers.',terms:['lamb','sheep']},
  {id:'bison',label:'Bison',description:'Bison products and sourcing records.',terms:['bison']},
 ]},
 {id:'poultry',label:'Poultry',description:'Chicken, turkey and duck.',icon:'bird',color:'wheat',groups:[
  {id:'chicken',label:'Chicken',description:'Chicken products and sourcing records.',terms:['chicken']},
  {id:'turkey',label:'Turkey',description:'Turkey products and sourcing records.',terms:['turkey']},
  {id:'duck',label:'Duck',description:'Duck products and sourcing records.',terms:['duck']},
 ]},
 {id:'dairy',label:'Dairy',description:'Milk, cheese and yogurt.',icon:'milk',color:'blue',groups:[
  {id:'milk',label:'Milk',description:'Milk-related products and producers.',terms:['milk']},
  {id:'cheese',label:'Cheese',description:'Cheese-related products and producers.',terms:['cheese']},
  {id:'yogurt',label:'Yogurt',description:'Yogurt-related products and producers.',terms:['yogurt']},
 ]},
 {id:'eggs',label:'Eggs & laying hens',description:'Egg products and laying-hen operations.',icon:'egg',color:'sage',groups:[
  {id:'eggs',label:'Egg products',description:'Records that explicitly mention eggs.',terms:['egg','eggs']},
  {id:'hens',label:'Laying hens',description:'Hen operations; product details may need checking.',terms:['hen','hens']},
 ]},
 {id:'other',label:'Other & unclassified',description:'Other livestock and records needing product details.',icon:'boxes',color:'lavender',groups:[
  {id:'goat',label:'Goat operations',description:'Goat records without assuming a meat or dairy product.',terms:['goat']},
  {id:'cattle',label:'Cattle operations',description:'Cattle listed without assuming a beef or dairy product.',terms:['cattle']},
  {id:'chicks',label:'Live chicks',description:'Hatchery and live-chick records.',terms:['chick','chicks']},
  {id:'unclassified',label:'Product details to verify',description:'The source does not provide a recognized product group.',terms:[]},
 ]},
];
export function productTerms(row:DirectoryEntry):Set<string>{return new Set((row.product_keywords||'').toLowerCase().split(/[;|]/).map(s=>s.trim()).filter(Boolean));}
const knownTerms=new Set(foodCategories.flatMap(f=>f.groups.flatMap(g=>g.terms)));
function unknown(row:DirectoryEntry){return ![...productTerms(row)].some(t=>knownTerms.has(t));}
export function matchesProductGroup(row:DirectoryEntry,group:ProductGroup){return group.id==='unclassified'?unknown(row):group.terms.some(t=>productTerms(row).has(t));}
export function matchesCategory(row:DirectoryEntry,categoryId:string,groupId=''){
 const cat=foodCategories.find(c=>c.id===categoryId);if(!cat)return true;
 return cat.groups.filter(g=>!groupId||g.id===groupId).some(g=>matchesProductGroup(row,g));
}
// Product and certification must occur in the same observed listing. A beef
// listing under one program must not borrow an egg certification from another.
export function matchingPrograms(row:DirectoryEntry,listings:DirectoryEntry[],categoryId='',groupId=''):string[]{
 if(categoryId&&!matchesCategory(row,categoryId,groupId))return [];
 const selectionUnknown=categoryId==='other'&&groupId==='unclassified';
 return [...new Set(listings.filter(l=>l.program_id&&(!categoryId||selectionUnknown||matchesCategory(l,categoryId,groupId))).map(l=>l.program_id))];
}
