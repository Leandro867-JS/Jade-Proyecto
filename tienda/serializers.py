from rest_framework import serializers
from .models import Producto, Categoria

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre')
    
    # Campos dinámicos para las monedas que necesita tu Sprint 3
    precio_clp = serializers.SerializerMethodField()
    precio_cop = serializers.SerializerMethodField()

    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'descripcion', 'categoria', 'categoria_nombre',
            'precio_base_usd', 'precio_clp', 'precio_cop', 
            'stock', 'imagen', 'disponible'
        ]

    # Lógica matemática de conversión
    def get_precio_clp(self, obj):
        tasa_clp = 950 # 1 USD = 950 CLP (aprox)
        return round(obj.precio_base_usd * tasa_clp)

    def get_precio_cop(self, obj):
        tasa_cop = 3900 # 1 USD = 3900 COP (aprox)
        return round(obj.precio_base_usd * tasa_cop)