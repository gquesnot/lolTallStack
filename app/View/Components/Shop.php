<?php

namespace App\View\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;

class Shop extends Component
{
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public string $version;
    public Collection $items;
    public array $modItems;
    public array $myItemList;
    public array $summoner;
    public int $selectedCategory = 0;
    public int $currentGold = 0;
    public array $itemCategory;


    public function __construct($version, $items, $summoner, $currentGold, $selectedCategory, $modItems,$myItemList, $itemCategory)
    {
        $this->version = $version;
        $this->items = $items;
        $this->summoner = $summoner;
        $this->currentGold = $currentGold;
        $this->modItems = $modItems;
        $this->selectedCategory = $selectedCategory;
        $this->myItemList = $myItemList;
        $this->itemCategory = $itemCategory;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view('components.shop');
    }
}
