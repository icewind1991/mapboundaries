{
  inputs = {
    nixpkgs.url = "nixpkgs/release-23.05";
    utils.url = "github:numtide/flake-utils";
    npmlock2nix = {
      url = "github:nix-community/npmlock2nix";
      flake = false;
    };
  };

  outputs = {
    self,
    nixpkgs,
    utils,
    npmlock2nix,
  }:
    utils.lib.eachDefaultSystem (system: let
      overlays = [
        (final: prev: {
          npmlock2nix = prev.callPackage npmlock2nix {};
        })
        (import ./overlay.nix)
      ];
      pkgs = import nixpkgs {
        inherit system overlays;
      };
      lib = pkgs.lib;
    in rec {
      packages = rec {
        map-boundaries = pkgs.map-boundaries;
        default = map-boundaries;
      };
      devShells.default = pkgs.mkShell {
        nativeBuildInputs = with pkgs; [
          nodejs_20
        ];
      };
    })
    // {
      overlays.default = import ./overlay.nix;
    };
}
