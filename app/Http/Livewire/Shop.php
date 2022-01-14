<?php

namespace App\Http\Livewire;

use Illuminate\Support\Collection;
use Livewire\Component;

class Shop extends Component
{
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public string $version;
    public Collection $items;


    public array $summoner;


    public int $baseGold;

    public array $itemCategory = [
        [
            "name" => "All Items",
            "tags" => [],
        ],
        [
            "name" => "Attack Damage",
            "tags" => ["Damage"],
        ],
        [
            "name" => "Critical Strike",
            "tags" => ["CriticalStrike"],
        ],
        [
            "name" => "Attack Speed",
            "tags" => ["AttackSpeed"],
        ],
        [
            "name" => "On-Hit Effects",
            "tags" => ["OnHit"],
        ],
        [
            "name" => "Armor Penetration",
            "tags" => ["ArmorPenetration"],
        ],
        [
            "name" => "Ability Power",
            "tags" => ["SpellDamage"],
        ],
        [
            "name" => "Mana & Regeneration",
            "tags" => ["Mana", "ManaRegeneration"],
        ],
        [
            "name" => "Magic Penetration",
            "tags" => ["MagicPenetration"],
        ],
        [
            "name" => "Health & Regeneration",
            "tags" => ["Health", "HealthRegen"],
        ],
        [
            "name" => "Armor",
            "tags" => ["Armor"],
        ],
        [
            "name" => "Magic Resistance",
            "tags" => ["SpellBlock"],
        ],
        [
            "name" => "Ability Haste",
            "tags" => ["AbilityHaste"],
        ],
        [
            "name" => "Movement",
            "tags" => ["Boots"],
        ],
        [
            "name" => "Life Steal & Vamp",
            "tags" => ["LifeSteal", "SpellVamp"],
        ],
    ];
    protected $listeners = ['changeBaseGold'];
    public function mount($version, $items, $summoner, $baseGold)
    {
        $this->version = $version;
        $this->items = $items;
        $this->summoner = $summoner;
        $this->baseGold = $baseGold;
        $this->myItemList = $summoner['items'];
        $this->applyCategory();
        $this->calcCurrentGold();
    }


    public function changeBaseGold($newBaseGold){
        $this->baseGold = $newBaseGold;
        $this->calcCurrentGold();
    }


    public function calcCurrentGold(){

        $gold = 0;
        foreach($this->myItemList as $itemId){
            foreach($this->items as $item){
                if ($item->id == $itemId)
                    $gold += $item->gold;
            }
        }
        $this->currentGold = $this->baseGold - $gold;
        $this->emit('changeCurrentGold', $this->currentGold);
    }

    public function removeItem($id)
    {
        array_splice($this->myItemList, $id, 1);
        $this->calcCurrentGold();
        //dd($this->myItemList);
    }

    public function addItem($id)
    {
        if (count($this->myItemList) < 6){
            $this->myItemList[] = $id;
            $this->calcCurrentGold();
        }
    }



    public function selectCategory($categoryIdx)
    {
        $this->selectedCategory = $categoryIdx;
        $this->applyCategory();

    }
    public function isTagsInCategory($tags, $category){
        foreach($tags as $tag){
            if (in_array($tag, $category['tags']))
                return true;
        }
        return false;

    }

    public function applyCategory(){
        $this->modItems = [];

        foreach ($this->items as $item){
            $tagsSplit = explode(";", $item->tags);
            if ($this->isTagsInCategory($tagsSplit, $this->itemCategory[$this->selectedCategory]) || $this->selectedCategory == 0)
                $this->modItems[] = $item;
        }
    }





    public function render()
    {
        return view('livewire.shop');
    }
}
