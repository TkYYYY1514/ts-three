<template>
    <div class="tabs no-select">
        <div v-for="item in tabsList" :key="item.label" :class="{ active: item.name.includes(($route.name ?? '') as string) }"
            @click="handleClick(item.name[0] ?? '')">
            <span>{{ item.label }}</span><span style="font-size: 12px; color: red;">
            </span>
        </div>
    </div>
</template>
<script setup lang="ts"> 
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();

const tabsList = [
    { label: '园区总览', name: ['overview'] },
    { label: '安全防控', name: ['safety'] },
    { label: '通行管控', name: ['access'] },
    { label: '绿色能耗', name: ['energy'] },
]

const handleClick = (name : string) => {
    if(name) router.push({ name });
};

</script>

<style lang="scss" scoped>
.tabs{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 5%;
    
    display: flex;
    gap: 120px;

    font-size: 30px;
    font-family: YouSheBiaoTiHei;
    color: rgba(255, 255, 255, 0.7); 

    >div{
        cursor:pointer;

        background: rgba(10, 172, 242, 0.2);        // 半透明背景（20% 不透明度）
  
        border: 1px solid rgba(255, 255, 255, 0.3); // 半透明边框（增加玻璃质感）

        border-radius: 8px;            
        padding: 5px 10px;
        transition: all 0.3s ease-in-out;
        &.active{
            background: rgba(10, 107, 242, 0.6);  
            color: rgb(255, 255, 255); 
            transform: translateY(-50%);
        }
    }
    
}
</style>