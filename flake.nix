{
  inputs = {
    nixpkgs.url = "nixpkgs/release-24.11";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    utils,
  }:
    utils.lib.eachDefaultSystem (system: let
      overlays = [
        (import ./nix/overlay.nix)
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
      overlays.default = import ./nix/overlay.nix;
    };
}
