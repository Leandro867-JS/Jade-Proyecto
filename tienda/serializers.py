from rest_framework import serializers
from .models import Producto, Categoria

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre')
    
   
    precio_clp = serializers.SerializerMethodField()
    precio_cop = serializers.SerializerMethodField()

    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'descripcion', 'categoria', 'categoria_nombre',
            'precio_base_usd', 'precio_clp', 'precio_cop', 
            'stock', 'imagen', 'disponible'
        ]

   
    def get_precio_clp(self, obj):
        tasa_clp = 950 
        return round(obj.precio_base_usd * tasa_clp)

    def get_precio_cop(self, obj):
        tasa_cop = 3900 
        return round(obj.precio_base_usd * tasa_cop)