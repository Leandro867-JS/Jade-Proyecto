from rest_framework import serializers
from .models import Producto, Categoria
from django.conf import settings

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
            'stock', 'imagen', 'disponible',
        ]

    def _convertir(self, obj, moneda):
        return round(obj.precio_base_usd * settings.TASAS_CAMBIO[moneda])

    def get_precio_clp(self, obj):
        return self._convertir(obj, 'CLP')

    def get_precio_cop(self, obj):
        return self._convertir(obj, 'COP')