<script setup>
import { ref, onMounted, computed } from "vue"
import { supabase } from "@/lib/supabase"

const products = ref([])

const search = ref("")
const categories = ref([])

const showModal = ref(false)

const form = ref({
  id:null,
  name:"",
  price:"",
  description:"",
  image:"",
  category_id:"" 
})
const isEdit = ref(false)

onMounted(() => {
  loadProducts()
  loadCategories()
})

const loadCategories = async () => {
  const { data } = await supabase
    .from("categories")
    .select("*")

  categories.value = data || []
}

const loadProducts = async ()=>{

const { data } = await supabase
.from("products")
.select(`
  *,
  category:categories(name)
`)
.order("created_at",{ascending:false})

products.value = data || []

}

const filteredProducts = computed(()=>{

return products.value.filter(p =>
p.name.toLowerCase().includes(search.value.toLowerCase())
)

})

const openAdd = ()=>{

isEdit.value=false

form.value={
  name:"",
  price:"",
  description:"",
  image:"",
  category_id:""
}

showModal.value=true

}

const openEdit = (product)=>{

isEdit.value=true

form.value={...product}

showModal.value=true

}

const saveProduct = async ()=>{

if(isEdit.value){

await supabase
.from("products")
.update({
name:form.value.name,
price:Number(form.value.price),
description:form.value.description,
image:form.value.image,
category_id: form.value.category_id 
})
.eq("id",form.value.id)

}else{

await supabase
.from("products")
.insert({
name:form.value.name,
price:Number(form.value.price),
description:form.value.description,
image:form.value.image,
category_id: form.value.category_id 
})

}

showModal.value=false

loadProducts()

}
const uploadImage = async (event)=>{

const file = event.target.files[0]

const fileName = Date.now() + "-" + file.name

const { data, error } = await supabase
.storage
.from("products")
.upload(fileName,file)

if(error){
console.log(error)
return
}

const { data:publicUrl } = supabase
.storage
.from("products")
.getPublicUrl(fileName)

form.value.image = publicUrl.publicUrl

}

const deleteProduct = async (id)=>{

if(!confirm("Delete this product?")) return

await supabase
.from("products")
.delete()
.eq("id",id)

loadProducts()

}
</script>



<template>

<h1 class="title">Products</h1>

<div class="top-bar">

<input
v-model="search"
placeholder="Search products..."
class="search"
/>

<button class="add" @click="openAdd">
Add Product
</button>

</div>

<table class="products-table">

<thead>
<tr>
<th>Image</th>
<th>Name</th>
<th>Price</th>
<th>Category</th>
<th>Actions</th>
</tr>
</thead>

<tbody>

<tr
v-for="product in filteredProducts"
:key="product.id"
>

<td>
<img :src="product.image" class="table-image"/>
</td>

<td>{{product.name}}</td>

<td>ل.س {{product.price}}</td>
<td>{{ product.category?.name }}</td>

<td>

<button
class="edit"
@click="openEdit(product)"
>
Edit
</button>

<button
class="delete"
@click="deleteProduct(product.id)"
>
Delete
</button>

</td>

</tr>

</tbody>

</table>
<div v-if="showModal" class="modal-overlay">

<div class="modal">

<h2>
{{ isEdit ? "Edit Product" : "Add Product" }}
</h2>

<input
v-model="form.name"
placeholder="Product name"
/>

<input
v-model="form.price"
type="number"
placeholder="Price"
/>
    <select v-model="form.category_id">
  <option disabled value="">اختر الفئة</option>

  <option
    v-for="cat in categories"
    :key="cat.id"
    :value="cat.id"
  >
    {{ cat.name }}
  </option>
</select>
<input type="file" @change="uploadImage" />

<img v-if="imagePreview" :src="imagePreview" class="preview"/>

<img
v-if="form.image"
:src="form.image"
style="width:120px;border-radius:8px"
/>

<textarea
v-model="form.description"
placeholder="Description"
/>

<div class="modal-actions">

<button
class="save"
@click="saveProduct"
>
Save
</button>

<button
class="cancel"
@click="showModal=false"
>
Cancel
</button>

</div>

</div>

</div>
</template>

<style scoped>

.title{
font-size:28px;
margin-bottom:20px;
}

.top-bar{
display:flex;
justify-content:space-between;
margin-bottom:20px;
}

.search{
padding:10px;
width:250px;
border-radius:8px;
border:1px solid #ddd;
background:var(--card-bg); color:var(--text);
}

.add{
background:var(--primary);
color:white;
border:none;
padding:10px 16px;
border-radius:8px;
cursor:pointer;
}

.products-table{
width:100%;
border-collapse:collapse;
background:var(--card-bg);
box-shadow:0 5px 15px rgba(0,0,0,0.05);
}

.products-table th,
.products-table td{
padding:14px;
border-bottom:1px solid #eee;
}

.table-image{
width:60px;
height:60px;
object-fit:cover;
border-radius:8px;
}

.edit{
background:#3d909e;
color:white;
border:none;
padding:6px 12px;
border-radius:6px;
margin-right:6px;
}

.delete{
background:#e74c3c;
color:white;
border:none;
padding:6px 12px;
border-radius:6px;
}

.modal-overlay{
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:var(--card-bg);
display:flex;
justify-content:center;
align-items:center;
}

.modal{
background:var(--card-bg);
padding:25px;
border-radius:12px;
width:400px;
display:flex;
flex-direction:column;
gap:10px;
}

.preview{
width:100%;
border-radius:8px;
}

.modal-actions{
display:flex;
justify-content:flex-end;
gap:10px;
margin-top:10px;
}
</style>